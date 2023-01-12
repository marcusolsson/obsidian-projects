import type { App } from "obsidian";
import { DataviewApi, getAPI, isPluginEnabled, Link } from "obsidian-dataview";
import { get } from "svelte/store";

import type { TableResult } from "obsidian-dataview/lib/api/plugin-api";
import {
  DataSource,
  emptyDataFrame,
  type DataField,
  type DataFrame,
  type DataRecord,
} from "src/lib/data";
import { detectFields, parseRecords } from "src/lib/datasources/helpers";
import { i18n } from "src/lib/stores/i18n";
import type { ProjectDefinition } from "src/types";

import { standardizeValues } from "./dataview-helpers";
import produce from "immer";
import type { ProjectsPluginPreferences } from "src/main";

export class UnsupportedCapability extends Error {
  constructor(message: string) {
    super(message);
    this.name = get(i18n).t("errors.missingDataview.title");
  }
}

/**
 * DataviewDataSource converts Dataview queries to DataFrames.
 */
export class DataviewDataSource extends DataSource {
  constructor(
    readonly app: App,
    project: ProjectDefinition,
    preferences: ProjectsPluginPreferences
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

    const api = this.getDataviewAPI();

    const result = await api?.query(
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

        return a.name.localeCompare(b.name);
      });
    });
  }

  includes(path: string): boolean {
    return !this.project.excludedNotes?.includes(path);
  }

  readonly(): boolean {
    return true;
  }

  getDataviewAPI(): DataviewApi | undefined {
    if (isPluginEnabled(this.app)) {
      return getAPI(this.app);
    } else {
      throw new UnsupportedCapability(
        get(i18n).t("errors.missingDataview.message")
      );
    }
  }

  standardizeRecords(rows: Array<Record<string, any>>): DataRecord[] {
    const records: DataRecord[] = [];

    rows
      .map((row) => ({ id: row["File"] as Link, row }))
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

function detectSchema(records: DataRecord[]): DataField[] {
  return detectFields(records)
    .map((field) => ({ ...field, derived: true }))
    .map((field) =>
      field.name === "File"
        ? produce(field, (draft) => {
            draft.identifier = true;
            draft.typeConfig = produce(draft.typeConfig ?? {}, (draft) => {
              draft.richText = true;
            });
          })
        : field
    );
}
