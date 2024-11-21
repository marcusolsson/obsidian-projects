import dayjs from "dayjs";
import { produce } from "immer";
import moment from "moment";
import { get } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

import {
  isDate,
  DataFieldType,
  type DataField,
  type DataRecord,
  type DataValue,
  type Optional,
} from "./dataframe/dataframe";
import { nextUniqueProjectName, notEmpty, getNameFromPath } from "./helpers";
import { decodeFrontMatter, encodeFrontMatter } from "./metadata";
import { i18n } from "./stores/i18n";
import { settings } from "./stores/settings";
import { interpolateTemplate } from "./templates/interpolate";

import { function as F, task as T, either as E, taskEither as TE } from "fp-ts";
import {
  DEFAULT_PROJECT,
  DEFAULT_VIEW,
  type ProjectDefinition,
} from "src/settings/settings";
import type { IFile, IFileSystem } from "./filesystem/filesystem";
import { normalizePath } from "obsidian";

/**
 * DataApi writes records to file.
 */
export class DataApi {
  constructor(readonly fileSystem: IFileSystem) {}

  async updateRecord(fields: DataField[], record: DataRecord): Promise<void> {
    const file = this.fileSystem.getFile(record.id);
    if (file) {
      await this.updateFile(file, (data) =>
        doUpdateRecord(data, fields, record)
      )();
    }
  }

  async updateRecords(
    fields: DataField[],
    records: DataRecord[]
  ): Promise<void> {
    await Promise.all(
      records.map(async (record) => {
        const file = this.fileSystem.getFile(record.id);
        if (file) {
          await this.updateFile(file, (data) =>
            doUpdateRecord(data, fields, record)
          )();
        }
      })
    );
  }

  async addField(
    paths: string[],
    field: DataField,
    value: Optional<DataValue>
  ): Promise<void> {
    await Promise.all(
      paths
        .map((path) => this.fileSystem.getFile(path))
        .filter(notEmpty)
        .map((file) =>
          this.updateFile(file, (data) => doAddField(data, field, value))()
        )
    );
  }

  async renameField(paths: string[], from: string, to: string): Promise<void> {
    Promise.all(
      paths
        .map((path) => this.fileSystem.getFile(path))
        .filter(notEmpty)
        .map((file) =>
          this.updateFile(file, (data) => doRenameField(data, from, to))()
        )
    );
  }

  async deleteField(paths: string[], name: string): Promise<void> {
    Promise.all(
      paths
        .map((path) => this.fileSystem.getFile(path))
        .filter(notEmpty)
        .map((file) =>
          this.updateFile(file, (data) => doDeleteField(data, name))()
        )
    );
  }

  async createNote(
    record: DataRecord,
    fields: DataField[],
    templatePath: string
  ): Promise<void> {
    let content = "";

    if (templatePath) {
      const file = this.fileSystem.getFile(templatePath);
      if (file) {
        content = await file.read();
        content = interpolateTemplate(content, {
          title: () => getNameFromPath(record.id),
          date: (format) => moment().format(format || "YYYY-MM-DD"),
          time: (format) => moment().format(format || "HH:mm"),
        });
        if (record.values["tags"]) {
          const templateTags = F.pipe(
            content,
            decodeFrontMatter,
            E.map((frontmatter) => frontmatter["tags"]),
            E.fold(
              () => [],
              (right) => right ?? [] // handle `null`
            )
          );
          //@ts-ignore explict input in `createDataRecord()`
          const tagSet: Set<string> = new Set(
            templateTags.concat(record.values["tags"])
          );
          record.values["tags"] = [...tagSet];
        }
      }
    }

    const file = await this.fileSystem.create(record.id, content);

    await this.updateFile(file, (data) =>
      doUpdateRecord(data, fields, record)
    )();
  }

  updateFile(
    file: IFile,
    cb: (data: string) => E.Either<Error, string>
  ): T.Task<void> {
    return F.pipe(
      TE.tryCatch((): Promise<string> => file.read(), E.toError),
      TE.map(cb),
      TE.chain(TE.fromEither),
      TE.chain((result) => TE.tryCatch(() => file.write(result), E.toError)),
      T.map(
        E.fold(
          (err) => {
            throw err;
          },
          () => {
            // new Notice("Updated file");
          }
        )
      )
    );
  }

  async deleteRecord(path: string) {
    const file = this.fileSystem.getFile(path);

    if (file) {
      file.delete();
    }
  }
}

export function doUpdateRecord(
  data: string,
  fields: DataField[],
  record: DataRecord
): E.Either<Error, string> {
  return F.pipe(
    data,
    decodeFrontMatter,
    E.map((frontmatter) => {
      return Object.fromEntries(
        Object.entries({ ...frontmatter, ...record.values })
          .map((entry) => {
            if (isDate(entry[1])) {
              const isDatetime = fields.find(
                (field) =>
                  field.name === entry[0] &&
                  field.type === DataFieldType.Date &&
                  (field.typeConfig?.time ||
                    entry[1].getHours() ||
                    entry[1].getMinutes() ||
                    entry[1].getSeconds() ||
                    entry[1].getMilliseconds())
              );

              return produce(entry, (draft) => {
                draft[1] = dayjs(entry[1]).format(
                  isDatetime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD"
                );
              });
            }
            return entry;
          })
          .filter(
            (entry) =>
              !fields.find((field) => field.name === entry[0] && field.derived)
          )
      );
    }),
    E.chain((updated) =>
      encodeFrontMatter(data, updated, getDefaultStringType())
    )
  );
}

export function doAddField(
  data: string,
  field: DataField,
  value: Optional<DataValue>
): E.Either<Error, string> {
  return F.pipe(
    data,
    decodeFrontMatter,
    E.map((frontmatter) => ({
      ...frontmatter,
      [field.name]: value,
    })),
    E.chain((frontmatter) =>
      encodeFrontMatter(data, frontmatter, getDefaultStringType())
    )
  );
}

export function doDeleteField(data: string, field: string) {
  return F.pipe(
    data,
    decodeFrontMatter,
    E.map((frontmatter) => ({
      ...frontmatter,
      [field]: undefined,
    })),
    E.chain((frontmatter) =>
      encodeFrontMatter(data, frontmatter, getDefaultStringType())
    )
  );
}

export function doRenameField(
  data: string,
  from: string,
  to: string
): E.Either<Error, string> {
  return F.pipe(
    data,
    decodeFrontMatter,
    E.map((frontmatter) => ({
      ...frontmatter,
      [to]: frontmatter[from],
      [from]: undefined,
    })),
    E.chain((frontmatter) =>
      encodeFrontMatter(data, frontmatter, getDefaultStringType())
    )
  );
}

export function createProject(): ProjectDefinition {
  return Object.assign({}, DEFAULT_PROJECT, {
    id: uuidv4(),
    name: nextUniqueProjectName(
      get(settings).projects,
      get(i18n).t("modals.project.create.untitled")
    ),
    views: [
      Object.assign({}, DEFAULT_VIEW, {
        id: uuidv4(),
        name: get(i18n).t("views.table.name"),
        type: "table",
      }),
    ],
  });
}

export function createDataRecord(
  name: string,
  project: ProjectDefinition,
  values?: Record<string, Optional<DataValue>>
): DataRecord {
  let path = "";

  if (project.dataSource.kind === "folder") {
    path = project.dataSource.config.path;
  }

  if (project.newNotesFolder) {
    path = project.newNotesFolder;
  }

  if (project.dataSource.kind == "tag") {
    values = {
      ...values,
      tags: [project.dataSource.config.tag.replace("#", "")],
    };
  }

  return {
    id: normalizePath(path + "/" + name + ".md"),
    values: values ?? {},
  };
}

function getDefaultStringType() {
  return get(settings).preferences?.frontmatter?.quoteStrings ?? "PLAIN";
}
