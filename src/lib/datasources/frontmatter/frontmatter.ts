import type { App, MetadataCache, TFile } from "obsidian";
import type { ProjectDefinition } from "../../../types";
import {
  DataSource,
  type DataField,
  type DataFrame,
  type DataRecord,
} from "../../data";
import { notEmpty } from "../../helpers";
import { standardizeRecord } from "./frontmatter-helpers";
import { detectFields, parseRecords } from "../helpers";

/**
 * FrontMatterDataSource converts Markdown front matter to DataFrames.
 */
export class FrontMatterDataSource extends DataSource {
  constructor(readonly app: App, project: ProjectDefinition) {
    super(project);
  }

  async queryOne(file: TFile, fields: DataField[]): Promise<DataFrame> {
    return this.queryFiles([file], fields);
  }

  async queryAll(): Promise<DataFrame> {
    const files = this.app.vault
      .getMarkdownFiles()
      .filter((file) => this.includes(file.path));

    return this.queryFiles(files);
  }

  async queryFiles(files: TFile[], predefinedFields?: DataField[]) {
    const standardizedRecords = standardizeRecords(
      files,
      this.app.metadataCache
    );
    let fields = detectSchema(standardizedRecords);

    for (let predefinedField of predefinedFields ?? []) {
      fields = fields.map((field) =>
        field.name !== predefinedField.name
          ? field
          : { ...field, type: predefinedField.type }
      );
    }

    const records = parseRecords(standardizedRecords, fields);

    return { fields, records };
  }

  includes(path: string): boolean {
    const trimmedPath = this.project.path.startsWith("/")
      ? this.project.path.slice(1)
      : this.project.path;

    // No need to continue if file is not below the project path.
    if (!path.startsWith(trimmedPath)) {
      return false;
    }

    if (!this.project.recursive) {
      const pathElements = path.split("/").slice(0, -1);
      const projectPathElements = trimmedPath.split("/").filter((el) => el);

      return pathElements.join("/") === projectPathElements.join("/");
    }

    return true;
  }
}

export function standardizeRecords(
  files: TFile[],
  metadataCache: MetadataCache
): DataRecord[] {
  const records: DataRecord[] = [];

  for (let file of files) {
    const cache = metadataCache.getFileCache(file);

    if (cache) {
      const { position, ...values }: { [key: string]: any } =
        cache.frontmatter ?? {};

      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => notEmpty(value))
      );

      filteredValues["path"] = file.path;
      filteredValues["name"] = file.basename;

      records.push(standardizeRecord(file.path, filteredValues));
    }
  }

  return records;
}

export function detectSchema(records: DataRecord[]): DataField[] {
  return detectFields(records)
    .map((field) =>
      field.name === "name" || field.name === "path"
        ? { ...field, derived: true }
        : field
    )
    .map((field) =>
      field.name === "path" ? { ...field, identifier: true } : field
    );
}
