import dayjs from "dayjs";
import produce from "immer";
import moment from "moment";
import { normalizePath, TFile, type App } from "obsidian";
import { get } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

import type { ProjectDefinition } from "src/types";

import {
  isDate,
  isLink,
  type DataField,
  type DataRecord,
  type DataValue,
  type Optional,
} from "./data";
import { nextUniqueProjectName } from "./helpers";
import { decodeFrontMatter, encodeFrontMatter } from "./metadata";
import { i18n } from "./stores/i18n";
import { settings } from "./stores/settings";
import { interpolateTemplate } from "./templates";

import { function as F, task as T, either as E, taskEither as TE } from "fp-ts";

/**
 * DataApi writes records to file.
 */
export class DataApi {
  constructor(readonly app: App) {}

  async updateRecord(fields: DataField[], record: DataRecord): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(record.id);

    if (file instanceof TFile) {
      await this.updateFile(file, (data) =>
        doUpdateRecord(data, fields, record)
      )();
    }
  }

  async renameField(files: TFile[], from: string, to: string): Promise<void> {
    for (const file of files) {
      await this.updateFile(file, (data) => doRenameField(data, from, to))();
    }
  }

  async deleteField(files: TFile[], name: string) {
    for (const file of files) {
      await this.updateFile(file, (data) => doDeleteField(data, name))();
    }
  }

  async createNote(record: DataRecord, templatePath: string): Promise<TFile> {
    let content = "";

    if (templatePath) {
      const templateFile = this.app.vault.getAbstractFileByPath(templatePath);

      if (templateFile instanceof TFile) {
        content = await this.app.vault.read(templateFile);
        content = interpolateTemplate(content, {
          title: () => (record.values["name"] as string | undefined) ?? "",
          date: (format) => moment().format(format || "YYYY-MM-DD"),
          time: (format) => moment().format(format || "HH:mm"),
        });
      }
    }

    const file = await this.app.vault.create(record.id, content);

    await this.updateFile(file, (data) => doUpdateRecord(data, [], record))();

    return file;
  }

  updateFile(
    file: TFile,
    cb: (data: string) => E.Either<Error, string>
  ): T.Task<void> {
    return F.pipe(
      TE.tryCatch((): Promise<string> => this.app.vault.read(file), E.toError),
      TE.map(cb),
      TE.chain(TE.fromEither),
      TE.chain((result) =>
        TE.tryCatch(() => this.app.vault.modify(file, result), E.toError)
      ),
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
    const file = this.app.vault.getAbstractFileByPath(path);

    if (file) {
      this.app.vault.trash(file, true);
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
          .map((entry) =>
            isDate(entry[1])
              ? produce(entry, (draft) => {
                  draft[1] = dayjs(entry[1]).format("YYYY-MM-DD");
                })
              : entry
          )
          .map((entry) =>
            isLink(entry[1])
              ? produce(entry, (draft) => {
                  draft[1] = `[[${draft[1].linkText}]]`;
                })
              : entry
          )
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
  return {
    id: uuidv4(),
    name: nextUniqueProjectName(
      get(settings).projects,
      get(i18n).t("modals.project.create.untitled")
    ),
    path: "",
    recursive: false,
    defaultName: "",
    templates: [],
    fields: {},
    views: [
      {
        id: uuidv4(),
        name: get(i18n).t("views.table.name"),
        type: "table",
        config: {},
      },
    ],
  };
}

export function createDataRecord(
  name: string,
  project: ProjectDefinition,
  values?: Record<string, Optional<DataValue>>
): DataRecord {
  return {
    id: normalizePath(project.path + "/" + name + ".md"),
    values: values ?? {},
  };
}

function getDefaultStringType() {
  return get(settings).preferences?.frontmatter?.quoteStrings ?? "PLAIN";
}
