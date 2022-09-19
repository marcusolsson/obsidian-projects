import dayjs from "dayjs";
import produce from "immer";
import moment from "moment";
import {
	MetadataCache,
	normalizePath,
	parseYaml,
	stringifyYaml,
	TFile,
	type App,
	type FrontMatterCache,
} from "obsidian";
import type { WorkspaceDefinition } from "src/main";
import { get } from "svelte/store";
import { fileIndex } from "./stores/file-index";
import { detectFields } from "./stores/helpers";
import { interpolateTemplate } from "./template";
import {
	DataFieldType,
	isDate,
	isLink,
	isRawLink,
	isString,
	type DataFrame,
	type DataRecord,
	type DataValue,
	type Link,
} from "./types";

export function createDataRecord(
	name: string,
	workspace: WorkspaceDefinition,
	values?: Record<string, DataValue>
): DataRecord {
	return {
		name,
		path: normalizePath(workspace.path + "/" + name + ".md"),
		values: values ?? {},
	};
}

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

	async createRecord(
		record: DataRecord,
		templatePath: string
	): Promise<void> {
		let content = "";

		if (templatePath) {
			const templateFile =
				this.app.vault.getAbstractFileByPath(templatePath);

			if (templateFile instanceof TFile) {
				content = await this.app.vault.read(templateFile);
				content = interpolateTemplate(content, {
					title: () => record.name,
					date: (format) => moment().format(format),
					time: (format) => moment().format(format),
				});
			}
		}

		const file = await this.app.vault.create(record.path, content);

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
