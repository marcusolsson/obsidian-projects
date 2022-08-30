import type { TFile, Vault } from "obsidian";

export enum DataFieldType {
	String = "string",
	Number = "number",
	Boolean = "boolean",
	Date = "date",
	Link = "link",
	Unknown = "unknown",
}

export interface Link {
	linkText: string;
	sourcePath: string;
}

export interface DataField {
	name: string;
	type: DataFieldType;
}

export type DataValue = string | number | boolean | Date | Link | null;

export interface DataRecord {
	name: string;
	path: string;
	values: Record<string, DataValue>;
}

export interface DataFrame {
	fields: DataField[];
	records: DataRecord[];
}

export abstract class DataSource {
	vault: Vault;

	constructor(vault: Vault) {
		this.vault = vault;
	}

	abstract load(file: TFile): Promise<DataFrame>;
	abstract save(file: TFile, frame: DataFrame): Promise<void>;
}

export function isBoolean(value: DataValue): value is boolean {
	return typeof value === "boolean";
}
export function isString(value: DataValue): value is string {
	return typeof value === "string";
}
export function isLink(value: DataValue): value is Link {
	if (value && typeof value === "object") {
		return "linkText" in value && "sourcePath" in value;
	}
}
export function isNumber(value: DataValue): value is number {
	return typeof value === "number";
}
export function isDate(value: DataValue): value is Date {
	return value instanceof Date;
}
