import type { App } from "obsidian";
import { DataviewApi, getAPI, isPluginEnabled } from "obsidian-dataview";
import type { TableResult } from "obsidian-dataview/lib/api/plugin-api";
import { get } from "svelte/store";
import { i18n } from "../../stores/i18n";
import {
  DataSource,
  type DataField,
  type DataFrame,
  type DataRecord,
} from "../../data";
import { standardizeValues } from "./dataview-helpers";
import { detectFields, isLink, parseRecords } from "../helpers";
import type { ProjectDefinition } from "src/types";

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
  constructor(readonly app: App, project: ProjectDefinition) {
    super(project);
  }

  async queryOne(): Promise<DataFrame> {
    return this.queryAll();
  }

  async queryAll(): Promise<DataFrame> {
    const api = this.getDataviewAPI();

    const result = await api?.query(this.project.query ?? "", undefined, {
      forceId: true,
    });

    if (!result?.successful || result.value.type !== "table") {
      throw new Error("dataview query failed");
    }

    const rows = parseTableResult(result.value);

    const standardizedRecords = this.standardizeRecords(rows);
    const fields = detectSchema(standardizedRecords);
    const records = parseRecords(standardizedRecords, fields);

    return { fields, records };
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

    rows.forEach((row) => {
      const values = standardizeValues(this.app, row);

      const id = values["File"];

      if (id && isLink(id) && id.fullPath) {
        records.push({ id: id.fullPath, values });
      }
    });

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
      field.name === "File" ? { ...field, identifier: true } : field
    );
}
