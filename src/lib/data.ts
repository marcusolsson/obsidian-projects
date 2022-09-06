/*
 * TODO: This file is in dire need of refactoring.
 */
import dayjs from "dayjs";
import produce from "immer";
import {
	MetadataCache,
	parseYaml,
	stringifyYaml,
	TFile,
	type App,
	type FrontMatterCache,
} from "obsidian";
import { get } from "svelte/store";
import { fileIndex } from "./stores/file-index";
import { detectFields } from "./stores/helpers";

export class DataApi {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	async updateRecord(record: DataRecord): Promise<void> {
		const file = this.app.vault.getAbstractFileByPath(record.path);

		if (file instanceof TFile) {
			this.updateFile(file, (data) => doUpdateRecord(data, record));
		}
	}

	async renameField(from: string, to: string): Promise<void> {
		for (let pair of Object.entries(get(fileIndex).files)) {
			this.updateFile(pair[1], (data) => doRenameField(data, from, to));
		}
	}

	async deleteField(name: string) {
		for (let pair of Object.entries(get(fileIndex).files)) {
			this.updateFile(pair[1], (data) => doDeleteField(data, name));
		}
	}

	async createRecord(record: DataRecord): Promise<void> {
		const file = await this.app.vault.create(record.path, "");
		this.updateFile(file, (data) => doUpdateRecord(data, record));
	}

	async updateFile(file: TFile, cb: (data: string) => string) {
		const data = await this.app.vault.read(file);
		await this.app.vault.modify(file, cb(data));
	}

	async deleteRecord(path: string) {
		const file = get(fileIndex).files[path];

		if (file) {
			this.app.vault.trash(file, true);
		}
	}

	createDataFrame(files: Record<string, TFile>): DataFrame {
		const records: DataRecord[] = parseRecords(
			Object.entries(files).map(([_, file]) => file),
			this.app.metadataCache
		);

		const fields = detectFields(records);

		// Enrich values based on detected field type.
		for (let record of records) {
			for (let field of fields) {
				const value = record.values[field.name];

				switch (field.type) {
					case DataFieldType.Link:
						if (isRawLink(value)) {
							record.values[field.name] = parseRawLink(
								value,
								record.path
							);
						}
						break;
					case DataFieldType.Date:
						if (value && isString(value)) {
							record.values[field.name] = dayjs(value).toDate();
						}
						break;
				}
			}
		}

		return { fields, records };
	}
}

function parseRawLink(
	rawLink: Array<Array<string>>,
	sourcePath: string
): Link | undefined {
	if (rawLink[0]) {
		const linkText = rawLink[0][0];

		if (linkText) {
			return {
				linkText,
				sourcePath,
			};
		}
	}
	return undefined;
}

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

export function parseRecords(
	files: TFile[],
	metadataCache: MetadataCache
): DataRecord[] {
	const records: DataRecord[] = [];

	for (let file of files) {
		const cache = metadataCache.getFileCache(file);

		if (cache) {
			const { position, ...values }: { [key: string]: any } =
				cache.frontmatter ?? {};

			records.push({
				name: file.basename,
				path: file.path,
				values,
			});
		}
	}

	return records;
}

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
	name: string;
	path: string;
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

export function doUpdateRecord(data: string, record: DataRecord): string {
	const frontmatter = decodeFrontMatter(data);

	const updated = Object.fromEntries(
		Object.entries({ ...frontmatter, ...record.values })
			.map((entry) =>
				isDate(entry[1])
					? produce(entry, (draft) => {
							draft[1] = dayjs(entry[1]).format("YYYY-MM-DD");
					  })
					: entry
			)
			.map((entry) =>
				isLink(entry[1])
					? produce(entry, (draft) => {
							draft[1] = `[[${draft[1].linkText}]]`;
					  })
					: entry
			)
			.filter((entry) => entry[1] !== undefined)
			.filter((entry) => entry[1] !== null)
	);

	const encoded = encodeFrontMatter(data, updated);

	return encoded.replace(/\"\[\[(.*)\]\]\"/, (_, p1) => {
		return `[[${p1}]]`;
	});
}

export function doDeleteField(data: string, field: string) {
	const frontmatter = decodeFrontMatter(data);

	frontmatter[field] = null;

	const updated = Object.fromEntries(
		Object.entries(frontmatter)
			.filter((entry) => entry[1] !== undefined)
			.filter((entry) => entry[1] !== null)
	);

	return encodeFrontMatter(data, updated);
}

export function doRenameField(data: string, from: string, to: string) {
	const frontmatter = decodeFrontMatter(data);

	frontmatter[to] = frontmatter[from];
	frontmatter[from] = null;

	const updated = Object.fromEntries(
		Object.entries(frontmatter)
			.filter((entry) => entry[1] !== undefined)
			.filter((entry) => entry[1] !== null)
	);

	return encodeFrontMatter(data, updated);
}

function decodeFrontMatter(data: string): Omit<FrontMatterCache, "position"> {
	const delim = "---";

	var startPosition = data.indexOf(delim) + delim.length;

	const isStart = data.slice(0, startPosition).trim() === delim;

	var endPosition = data.slice(startPosition).indexOf(delim) + startPosition;

	const hasFrontMatter = isStart && endPosition > startPosition;

	const { position, ...cache }: FrontMatterCache = hasFrontMatter
		? parseYaml(data.slice(startPosition, endPosition))
		: {};

	return cache;
}

function encodeFrontMatter(
	data: string,
	frontmatter: Omit<FrontMatterCache, "position>">
): string {
	const delim = "---";

	var startPosition = data.indexOf(delim) + delim.length;

	const isStart = data.slice(0, startPosition).trim() === delim;

	var endPosition = data.slice(startPosition).indexOf(delim) + startPosition;

	const hasFrontMatter = isStart && endPosition > startPosition;

	if (Object.entries(frontmatter).length) {
		const res = hasFrontMatter
			? data.slice(0, startPosition + 1) +
			  stringifyYaml(frontmatter) +
			  data.slice(endPosition)
			: delim + "\n" + stringifyYaml(frontmatter) + delim + "\n\n" + data;

		return res;
	}

	return hasFrontMatter
		? data.slice(0, startPosition - delim.length) +
				data.slice(endPosition + delim.length + 1)
		: data;
}
