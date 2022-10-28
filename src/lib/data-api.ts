import dayjs from "dayjs";
import produce from "immer";
import moment from "moment";
import {
  normalizePath,
  parseYaml,
  stringifyYaml,
  TFile,
  type App,
  type FrontMatterCache,
} from "obsidian";
import { get } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import type { ProjectDefinition } from "../types";
import { i18n } from "./stores/i18n";
import { settings } from "./stores/settings";
import { interpolateTemplate } from "./templates";
import {
  isDate,
  isLink,
  type DataField,
  type DataRecord,
  type DataValue,
} from "./data";
import { nextUniqueProjectName } from "./helpers";

/**
 * DataApi writes records to file.
 */
export class DataApi {
  constructor(readonly app: App) {}

  async updateRecord(fields: DataField[], record: DataRecord): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(record.id);

    if (file instanceof TFile) {
      this.updateFile(file, (data) => doUpdateRecord(data, fields, record));
    }
  }

  async renameField(files: TFile[], from: string, to: string): Promise<void> {
    for (let file of files) {
      this.updateFile(file, (data) => doRenameField(data, from, to));
    }
  }

  async deleteField(files: TFile[], name: string) {
    for (let file of files) {
      this.updateFile(file, (data) => doDeleteField(data, name));
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

    this.updateFile(file, (data) => doUpdateRecord(data, [], record));

    return file;
  }

  async updateFile(file: TFile, cb: (data: string) => string) {
    const data = await this.app.vault.read(file);
    await this.app.vault.modify(file, cb(data));
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
): string {
  const frontmatter = decodeFrontMatter(data);

  const updated = Object.fromEntries(
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
      .filter((entry) => entry[1] !== undefined)
      .filter((entry) => entry[1] !== null)
  );

  const encoded = encodeFrontMatter(data, updated);

  return encoded.replace(/\"\[\[(.*)\]\]\"/, (_, p1) => {
    return `[[${p1}]]`;
  });
}

export function doDeleteField(data: string, field: string) {
  const frontmatter = decodeFrontMatter(data);

  frontmatter[field] = null;

  const updated = Object.fromEntries(
    Object.entries(frontmatter)
      .filter((entry) => entry[1] !== undefined)
      .filter((entry) => entry[1] !== null)
  );

  return encodeFrontMatter(data, updated);
}

export function doRenameField(data: string, from: string, to: string) {
  const frontmatter = decodeFrontMatter(data);

  frontmatter[to] = frontmatter[from];
  frontmatter[from] = null;

  const updated = Object.fromEntries(
    Object.entries(frontmatter)
      .filter((entry) => entry[1] !== undefined)
      .filter((entry) => entry[1] !== null)
  );

  return encodeFrontMatter(data, updated);
}

function decodeFrontMatter(data: string): Omit<FrontMatterCache, "position"> {
  const delim = "---";

  var startPosition = data.indexOf(delim) + delim.length;

  const isStart = data.slice(0, startPosition).trim() === delim;

  var endPosition = data.slice(startPosition).indexOf(delim) + startPosition;

  const hasFrontMatter = isStart && endPosition > startPosition;

  const { position, ...cache }: FrontMatterCache = hasFrontMatter
    ? parseYaml(data.slice(startPosition, endPosition))
    : {};

  return cache;
}

function encodeFrontMatter(
  data: string,
  frontmatter: Omit<FrontMatterCache, "position>">
): string {
  const delim = "---";

  var startPosition = data.indexOf(delim) + delim.length;

  const isStart = data.slice(0, startPosition).trim() === delim;

  var endPosition = data.slice(startPosition).indexOf(delim) + startPosition;

  const hasFrontMatter = isStart && endPosition > startPosition;

  if (Object.entries(frontmatter).length) {
    const res = hasFrontMatter
      ? data.slice(0, startPosition + 1) +
        stringifyYaml(frontmatter) +
        data.slice(endPosition)
      : delim + "\n" + stringifyYaml(frontmatter) + delim + "\n\n" + data;

    return res;
  }

  return hasFrontMatter
    ? data.slice(0, startPosition - delim.length) +
        data.slice(endPosition + delim.length + 1)
    : data;
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
  values?: Record<string, DataValue>
): DataRecord {
  return {
    id: normalizePath(project.path + "/" + name + ".md"),
    values: values ?? {},
  };
}
