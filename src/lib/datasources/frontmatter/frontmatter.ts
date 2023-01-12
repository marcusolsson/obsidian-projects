import type { App, TFile, Vault } from "obsidian";

import {
  DataSource,
  type DataField,
  type DataFrame,
  type DataRecord,
} from "src/lib/data";
import {
  detectFields,
  parseRecords,
  TooManyNotesError,
} from "src/lib/datasources/helpers";
import { notUndefined } from "src/lib/helpers";
import { decodeFrontMatter } from "src/lib/metadata";
import type { ProjectDefinition } from "src/types";

import { array as A, either as E, function as F } from "fp-ts";
import { standardizeRecord } from "./frontmatter-helpers";
import produce from "immer";
import type { ProjectsPluginPreferences } from "src/main";

/**
 * FrontMatterDataSource converts Markdown front matter to DataFrames.
 */
export abstract class FrontMatterDataSource extends DataSource {
  constructor(
    readonly app: App,
    project: ProjectDefinition,
    preferences: ProjectsPluginPreferences
  ) {
    super(project, preferences);
  }

  async queryOne(file: TFile, fields: DataField[]): Promise<DataFrame> {
    return this.queryFiles([file], fields);
  }

  async queryAll(): Promise<DataFrame> {
    const files = this.app.vault
      .getMarkdownFiles()
      .filter((file) => this.includes(file.path));

    if (files.length > this.preferences.projectSizeLimit) {
      throw new TooManyNotesError(
        files.length,
        this.preferences.projectSizeLimit
      );
    }

    return this.queryFiles(files);
  }

  async queryFiles(files: TFile[], predefinedFields?: DataField[]) {
    const standardizedRecords = await standardizeRecords(files, this.app.vault);

    const res = A.separate(standardizedRecords);

    let fields = this.sortFields(detectSchema(res.right));

    for (const f in this.project.fieldConfig) {
      fields = fields.map<DataField>((field) =>
        field.name !== f
          ? field
          : {
              ...field,
              typeConfig: {
                ...this.project.fieldConfig?.[f],
                ...field.typeConfig,
              },
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

  sortFields(fields: DataField[]): DataField[] {
    return produce(fields, (draft) => {
      draft.sort((a, b) => {
        if (a.name === "name" || a.name === "path") {
          return -1;
        }

        if (b.name === "name" || b.name === "path") {
          return 1;
        }

        return a.name.localeCompare(b.name);
      });
    });
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
          name: `[[${file.path}|${file.basename}]]`,
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
    .map<DataField>((field) =>
      field.name === "name"
        ? produce(field, (draft) => {
            draft.derived = true;
            draft.typeConfig = produce(field.typeConfig ?? {}, (draft) => {
              draft.richText = true;
            });
          })
        : field
    )
    .map<DataField>((field) =>
      field.name === "path"
        ? produce(field, (draft) => {
            draft.derived = true;
          })
        : field
    );
}
