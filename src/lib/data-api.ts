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
  type OptionalDataValue,
} from "./data";
import { nextUniqueProjectName } from "./helpers";
import { decodeFrontMatter, encodeFrontMatter } from "./metadata";
import { i18n } from "./stores/i18n";
import { settings } from "./stores/settings";
import { interpolateTemplate } from "./templates";

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
    for (const file of files) {
      this.updateFile(file, (data) => doRenameField(data, from, to));
    }
  }

  async deleteField(files: TFile[], name: string) {
    for (const file of files) {
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
  );

  return encodeFrontMatter(data, updated);
}

export function doDeleteField(data: string, field: string) {
  const frontmatter = decodeFrontMatter(data);

  frontmatter[field] = undefined;

  return encodeFrontMatter(data, frontmatter);
}

export function doRenameField(data: string, from: string, to: string) {
  const frontmatter = decodeFrontMatter(data);

  frontmatter[to] = frontmatter[from];
  frontmatter[from] = undefined;

  return encodeFrontMatter(data, frontmatter);
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
  values?: Record<string, OptionalDataValue>
): DataRecord {
  return {
    id: normalizePath(project.path + "/" + name + ".md"),
    values: values ?? {},
  };
}
