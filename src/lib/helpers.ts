import dayjs from "dayjs";
import type { App, TFile } from "obsidian";
import { isDate } from "util/types";
import {
	DataFieldType,
	isNumber,
	isString,
	type DataField,
	type DataFrame,
	type DataRecord,
} from "./datasource";

export function alphabet() {
	const alpha = Array.from(Array(26)).map((e, i) => i + 65);
	const alphabet = alpha.map((x) => String.fromCharCode(x));

	return alphabet;
}

export function isShortcutKey(event: KeyboardEvent): boolean {
	if (process.platform === "darwin") {
		return event.metaKey;
	}
	return event.ctrlKey;
}

export function fieldIcon(field: DataFieldType): string {
	switch (field) {
		case DataFieldType.String:
			return "text";
		case DataFieldType.Number:
			return "hash";
		case DataFieldType.Boolean:
			return "check";
		case DataFieldType.Date:
			return "calendar-days";
		case DataFieldType.Link:
			return "link";
	}
	return "info";
}

export interface FieldConfiguration {
	name: string;
	description: string;
	type: DataFieldType;
}

export function filesToDataFrame(
	app: App,
	files: Record<string, TFile>,
	workspacePath: string,
	recursive: boolean
): Readonly<DataFrame> {
	const fieldSet: Record<string, DataFieldType> = {};
	const records: DataRecord[] = [];

	for (const [_, file] of Object.entries(files)) {
		const cache = app.metadataCache.getFileCache(file);

		if (cache) {
			const { position, ...values }: { [key: string]: any } =
				cache.frontmatter ?? {};

			for (let field in values) {
				if (field !== "position") {
					fieldSet[field] = fieldType(values[field]);
				}
			}

			records.push({
				name: file.basename,
				path: file.path,
				values,
			});
		}
	}

	let fields: DataField[] = [];

	for (let field in fieldSet) {
		const type = fieldSet[field];

		if (type && type !== DataFieldType.Unknown) {
			fields.push({ name: field, type });
		}
	}

	fields = [
		...fields.sort((a, b) => {
			return a.name.localeCompare(b.name);
		}),
	];

	for (let record of records) {
		for (let field of fields) {
			const value = record.values[field.name];

			if (field.type === DataFieldType.Date) {
				if (value && isString(value)) {
					record.values[field.name] = dayjs(
						value,
						"YYYY-MM-DD"
					).toDate();
				}
			} else if (field.type === DataFieldType.Link) {
				if (value) {
					if (Array.isArray(value)) {
						const linkText = value[0][0];
						if (linkText && isString(linkText)) {
							record.values[field.name] = {
								linkText,
								sourcePath: record.path,
							};
						}
					}
				}
			}
		}
	}

	return { fields, records };
}

function fieldType(value: any): DataFieldType {
	if (isDate(value)) {
		return DataFieldType.Date;
	} else if (isString(value)) {
		return /\d{4}-\d{2}-\d{2}/.test(value)
			? DataFieldType.Date
			: DataFieldType.String;
	} else if (isNumber(value)) {
		return DataFieldType.Number;
	} else if (isBoolean(value)) {
		return DataFieldType.Boolean;
	} else if (Array.isArray(value)) {
		if (value.length === 1) {
			const innerValue = value[0];

			if (Array.isArray(innerValue) && innerValue.length === 1) {
				return DataFieldType.Link;
			}
		}
	}
	return DataFieldType.Unknown;
}

export function fieldToSelectableValue(field: DataField): {
	label: string;
	value: string;
} {
	return {
		label: field.name,
		value: field.name,
	};
}
