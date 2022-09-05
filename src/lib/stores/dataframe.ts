import { derived } from "svelte/store";

import dayjs from "dayjs";
import type { MetadataCache, TFile } from "obsidian";
import {
	DataFieldType,
	isString,
	type DataFrame,
	type DataRecord,
	type Link,
} from "../data";
import { fileIndex } from "./file-index";
import { detectFields } from "./helpers";
import { app } from "./obsidian";

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

export const dataFrame = derived(
	[app, fileIndex],
	([$app, $fileIndex]): DataFrame => {
		const files = $fileIndex.files;

		const records: DataRecord[] = parseRecords(
			Object.entries(files).map(([_, file]) => file),
			$app.metadataCache
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
);

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
