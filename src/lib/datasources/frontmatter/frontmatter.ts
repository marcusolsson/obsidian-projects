import type { App, TFile, Vault } from "obsidian";

import {
  DataSource,
  type DataField,
  type DataFrame,
  type DataRecord,
} from "src/lib/data";
import { detectFields, parseRecords } from "src/lib/datasources/helpers";
import { notUndefined } from "src/lib/helpers";
import { decodeFrontMatter } from "src/lib/metadata";
import type { ProjectDefinition } from "src/types";

import { array as A, either as E, function as F } from "fp-ts";
import { standardizeRecord } from "./frontmatter-helpers";

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
    const standardizedRecords = await standardizeRecords(files, this.app.vault);

    const res = A.separate(standardizedRecords);

    let fields = detectSchema(res.right);

    for (const f in this.project.fieldConfig) {
      fields = fields.map<DataField>((field) =>
        field.name !== f
          ? field
          : {
              ...field,
              typeConfig: this.project.fieldConfig?.[f] ?? {},
            }
      );
    }

    for (const predefinedField of predefinedFields ?? []) {
      fields = fields.map((field) =>
        field.name !== predefinedField.name
          ? field
          : { ...field, type: predefinedField.type }
      );
    }

    const records = parseRecords(res.right, fields);

    return { fields, records, errors: res.left };
  }

  includes(path: string): boolean {
    if (this.project.excludedNotes?.includes(path)) {
      return false;
    }

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

export class RecordError extends Error {
  constructor(readonly recordId: string, readonly err: Error) {
    super(err.message);
  }
}

export async function standardizeRecords(
  files: TFile[],
  vault: Vault
): Promise<E.Either<RecordError, DataRecord>[]> {
  return Promise.all(
    files.map(async (file) => {
      return F.pipe(
        await vault.read(file),
        decodeFrontMatter,
        E.mapLeft((e) => new RecordError(file.path, e)),
        E.map(filterUndefinedValues),
        E.map((values) => ({
          ...values,
          path: file.path,
          name: file.basename,
        })),
        E.map((values) => standardizeRecord(file.path, values))
      );
    })
  );
}

function filterUndefinedValues(val: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(val).filter(([_key, value]) => notUndefined(value))
  );
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
