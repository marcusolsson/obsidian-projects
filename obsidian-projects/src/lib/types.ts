import type { TFile } from "obsidian";
import type { WorkspaceDefinition } from "../types";

export enum DataFieldType {
	String = "string",
	Number = "number",
	Boolean = "boolean",
	Date = "date",
	Link = "link",
	List = "list",
	Unknown = "unknown",
}

export interface Link {
	linkText: string;
	sourcePath: string;
}

export interface DataField {
	name: string;
	type: DataFieldType;
	identifier: boolean;
	derived: boolean;
}

export type DataValue =
	| string
	| number
	| boolean
	| Date
	| Link
	| Array<string>
	| undefined;

export interface DataRecord {
	id: string;
	values: Record<string, DataValue>;
}

export interface DataFrame {
	fields: DataField[];
	records: DataRecord[];
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
	return false;
}
export function isNumber(value: DataValue): value is number {
	return typeof value === "number";
}
export function isDate(value: DataValue): value is Date {
	return value instanceof Date;
}

export function isOptionalBoolean(
	value: DataValue
): value is boolean | undefined {
	return typeof value === "boolean" || value === undefined;
}
export function isOptionalString(
	value: DataValue
): value is string | undefined {
	return typeof value === "string" || value === undefined;
}
export function isOptionalLink(value: DataValue): value is Link | undefined {
	if (typeof value === "object") {
		return "linkText" in value && "sourcePath" in value;
	}
	return value === undefined;
}
export function isOptionalList(
	value: DataValue
): value is Array<string> | undefined {
	return Array.isArray(value) || value === undefined;
}
export function isOptionalNumber(
	value: DataValue
): value is number | undefined {
	return typeof value === "number" || value === undefined;
}
export function isOptionalDate(value: DataValue): value is Date | undefined {
	return value instanceof Date || value === undefined;
}

export const emptyDataFrame: DataFrame = {
	records: [],
	fields: [],
};

export function isRawLink(value: any): value is Array<Array<string>> {
	if (value && Array.isArray(value)) {
		if (value.length === 1) {
			const nextValue = value[0];

			if (nextValue && Array.isArray(nextValue)) {
				return nextValue.length === 1;
			}
		}
	}
	return false;
}

export abstract class DataSource {
	workspace: WorkspaceDefinition;

	constructor(workspace: WorkspaceDefinition) {
		this.workspace = workspace;
	}

	abstract queryAll(): Promise<DataFrame>;
	abstract queryOne(file: TFile): Promise<DataFrame>;
	abstract includes(path: string): boolean;

	readonly(): boolean {
		return false;
	}
}
