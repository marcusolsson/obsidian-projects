import type { TFile } from "obsidian";
import { DataviewApi, getAPI, isPluginEnabled } from "obsidian-dataview";
import type { TableResult } from "obsidian-dataview/lib/api/plugin-api";
import { get } from "svelte/store";
import { i18n } from "../stores/i18n";
import {
	DataSource,
	isString,
	type DataField,
	type DataFrame,
	type DataRecord,
} from "../types";
import { standardizeValues } from "./dataview-helpers";
import { detectFields } from "./helpers";

export class UnsupportedCapability extends Error {
	constructor(message: string) {
		super(message);
		this.name = get(i18n).t("errors.missingDataview.title");
	}
}

export class DataviewDataSource extends DataSource {
	async queryOne(_: TFile): Promise<DataFrame> {
		return this.queryAll();
	}

	async queryAll(): Promise<DataFrame> {
		const api = getDataviewAPI();

		const result = await api?.query(this.workspace.query ?? "", undefined, {
			forceId: true,
		});

		if (!result?.successful || result.value.type !== "table") {
			throw new Error("dataview query failed");
		}

		const rows = parseTableResult(result.value);

		const records = parseRecords(rows);
		const fields = detectSchema(records);

		return { fields, records };
	}

	includes(_: string): boolean {
		return true;
	}

	readonly(): boolean {
		return true;
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

function parseRecords(rows: Array<Record<string, any>>): DataRecord[] {
	const records: DataRecord[] = [];

	rows.forEach((row) => {
		const values = standardizeValues(row);

		const id = values["File"];

		if (id && isString(id)) {
			records.push({ id, values });
		}
	});

	return records;
}

function detectSchema(records: DataRecord[]): DataField[] {
	return detectFields(records)
		.map((field) => ({ ...field, derived: true }))
		.map((field) =>
			field.name === "File" ? { ...field, identifier: true } : field
		);
}

function getDataviewAPI(): DataviewApi | undefined {
	if (isPluginEnabled(app)) {
		return getAPI(app);
	} else {
		throw new UnsupportedCapability(
			get(i18n).t("errors.missingDataview.message")
		);
	}
}
