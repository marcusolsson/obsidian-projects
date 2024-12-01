import type {
  DataField,
  DataFrame,
  DataRecord,
} from "src/lib/dataframe/dataframe";
import {
  detectFields,
  parseRecords,
  TooManyNotesError,
} from "src/lib/datasources/helpers";

import type { IFile, IFileSystem } from "src/lib/filesystem/filesystem";
import { notUndefined } from "src/lib/helpers";
import { decodeFrontMatter } from "src/lib/metadata";

import { array as A, either as E, function as F } from "fp-ts";
import { standardizeRecord } from "./standardize";
import { produce } from "immer";
import type {
  ProjectDefinition,
  ProjectsPluginPreferences,
} from "src/settings/settings";
import { DataSource } from "..";

/**
 * FrontMatterDataSource is a intermediate data source for records that use
 * front matter to define data. Compare with the Dataview data source which
 * instead uses the Dataview API to define data.
 */
export abstract class FrontMatterDataSource extends DataSource {
  constructor(
    readonly fileSystem: IFileSystem,
    project: ProjectDefinition,
    preferences: ProjectsPluginPreferences
  ) {
    super(project, preferences);
  }

  async queryOne(file: IFile, fields: DataField[]): Promise<DataFrame> {
    return this.queryFiles([file], fields);
  }

  async queryAll(): Promise<DataFrame> {
    const files = this.fileSystem
      .getAllFiles()
      .filter(({ path }) => this.includes(path));

    if (files.length > this.preferences.projectSizeLimit) {
      throw new TooManyNotesError(
        files.length,
        this.preferences.projectSizeLimit
      );
    }

    return this.queryFiles(files);
  }

  async queryFiles(files: IFile[], predefinedFields?: DataField[]) {
    const standardizedRecords = await standardizeRecords(files);

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

        return a.name.localeCompare(b.name, undefined, { numeric: true });
      });
    });
  }
}

export class RecordError extends Error {
  constructor(
    readonly recordId: string,
    readonly err: Error
  ) {
    super(err.message);
  }
}

export async function standardizeRecords(
  files: IFile[]
): Promise<E.Either<RecordError, DataRecord>[]> {
  return Promise.all(
    files.map(async (file) => {
      return F.pipe(
        await file.read(),
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
