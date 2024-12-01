import { produce } from "immer";
import type { DataviewApi, Link } from "obsidian-dataview";
import type { TableResult } from "obsidian-dataview/lib/api/plugin-api";
import {
  emptyDataFrame,
  type DataField,
  type DataFrame,
  type DataRecord,
} from "src/lib/dataframe/dataframe";
import type { IFileSystem } from "src/lib/filesystem/filesystem";
import { i18n } from "src/lib/stores/i18n";
import type {
  ProjectDefinition,
  ProjectsPluginPreferences,
} from "src/settings/settings";
import { get } from "svelte/store";
import { DataSource } from "..";
import { parseRecords } from "../helpers";
import { detectSchema } from "./schema";
import { standardizeValues } from "./standardize";

export class UnsupportedCapability extends Error {
  constructor(message: string) {
    super(message);
    this.name = get(i18n).t("errors.missingDataview.title");
  }
}

/**
 * DataviewDataSource returns a collection of notes using Dataview queries.
 */
export class DataviewDataSource extends DataSource {
  constructor(
    readonly fileSystem: IFileSystem,
    project: ProjectDefinition,
    preferences: ProjectsPluginPreferences,
    readonly api: DataviewApi
  ) {
    super(project, preferences);
  }

  async queryOne(): Promise<DataFrame> {
    return this.queryAll();
  }

  async queryAll(): Promise<DataFrame> {
    if (this.project.dataSource.kind !== "dataview") {
      return emptyDataFrame;
    }

    const result = await this.api.query(
      this.project.dataSource.config.query ?? "",
      undefined,
      {
        forceId: true,
      }
    );

    if (!result?.successful || result.value.type !== "table") {
      throw new Error("dataview query failed");
    }

    const rows = parseTableResult(result.value);

    const standardizedRecords = this.standardizeRecords(rows);

    let fields = this.sortFields(
      detectSchema(standardizedRecords),
      result.value.headers
    );

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

    const records = parseRecords(standardizedRecords, fields);

    return { fields, records };
  }

  sortFields(fields: DataField[], headers: string[]): DataField[] {
    return produce(fields, (draft) => {
      draft.sort((a, b) => {
        const aval = headers.indexOf(a.name);
        const bval = headers.indexOf(b.name);

        const distance = aval - bval;

        if (distance !== 0) {
          return distance;
        }

        return a.name.localeCompare(b.name, undefined, { numeric: true });
      });
    });
  }

  includes(path: string): boolean {
    return !this.project.excludedNotes?.includes(path);
  }

  readonly(): boolean {
    return true;
  }

  standardizeRecords(rows: Array<Record<string, any>>): DataRecord[] {
    const records: DataRecord[] = [];

    const columnName = this.api.settings.tableIdColumnName;

    rows
      .map((row) => ({ id: row[columnName] as Link, row }))
      .forEach(({ id, row }) =>
        records.push({ id: id.path, values: standardizeValues(row) })
      );

    return records;
  }
}

function parseTableResult(value: TableResult): Array<Record<string, any>> {
  const headers: string[] = value.headers;

  const rows: Array<Record<string, any>> = [];

  value.values.forEach((row) => {
    const values: Record<string, any> = {};

    headers.forEach((header, index) => {
      const value = row[index];
      values[header] = value;
    });

    rows.push(values);
  });

  return rows;
}
