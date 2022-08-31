import dayjs from "dayjs";
import { link } from "fs";
import type { App, TFile } from "obsidian";
import {
	DataFieldType,
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

	for (const [path, file] of Object.entries(files)) {
		if (!path.startsWith(workspacePath)) {
			continue;
		}

		if (!recursive) {
			const pathElements = path.split("/").slice(0, -1);
			const workspacePathElements = workspacePath
				.split("/")
				.filter((el) => el);

			if (
				!recursive &&
				pathElements.join("/") !== workspacePathElements.join("/")
			) {
				continue;
			}
		}

		const cache = app.metadataCache.getFileCache(file);

		if (cache) {
			const frontmatter = cache.frontmatter;

			for (let field in frontmatter) {
				if (field !== "position") {
					fieldSet[field] = fieldType(frontmatter?.[field]);
				}
			}

			records.push({
				name: file.basename,
				path: file.path,
				values: frontmatter ?? {},
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
	if (typeof value === "string") {
		return /\d{4}-\d{2}-\d{2}/.test(value)
			? DataFieldType.Date
			: DataFieldType.String;
	} else if (typeof value === "number") {
		return DataFieldType.Number;
	} else if (typeof value === "boolean") {
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
