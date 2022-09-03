import { derived } from "svelte/store";

import { app } from "./obsidian";
import { fileIndex } from "./file-index";
import {
	DataFieldType,
	isDate,
	isNumber,
	isString,
	type DataField,
	type DataFrame,
	type DataRecord,
} from "../data";
import dayjs from "dayjs";

export const dataFrame = derived(
	[app, fileIndex],
	([$app, $fileIndex]): DataFrame => {
		const files = $fileIndex.files;
		const fieldSet: Record<string, DataFieldType> = {};
		const records: DataRecord[] = [];

		for (const [_, file] of Object.entries(files)) {
			const cache = $app.metadataCache.getFileCache(file);

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
);

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
