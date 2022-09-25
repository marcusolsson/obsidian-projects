import type { App, MetadataCache, TFile } from "obsidian";
import type { WorkspaceDefinition } from "obsidian-projects/src/types";
import {
	DataFieldType,
	DataSource,
	type DataField,
	type DataFrame,
	type DataRecord,
} from "../types";
import { standardizeRecord } from "./frontmatter-helpers";
import { detectFields, stringFallback } from "./helpers";

export class FrontMatterDataSource extends DataSource {
	app: App;

	constructor(app: App, workspace: WorkspaceDefinition) {
		super(workspace);

		this.app = app;
	}

	async queryOne(file: TFile): Promise<DataFrame> {
		return this.queryFiles([file]);
	}

	async queryAll(): Promise<DataFrame> {
		const files = this.app.vault
			.getMarkdownFiles()
			.filter((file) => this.includes(file.path));

		return this.queryFiles(files);
	}

	async queryFiles(files: TFile[]) {
		let records = parseRecords(files, this.app.metadataCache);
		const fields = detectSchema(records);

		fields
			.filter((field) => field.type === DataFieldType.String)
			.map((field) => field.name)
			.forEach((field) => {
				records = stringFallback(records, field);
			});

		return { fields, records };
	}

	includes(path: string): boolean {
		const trimmedWorkspacePath = this.workspace.path.startsWith("/")
			? this.workspace.path.slice(1)
			: this.workspace.path;

		// No need to continue if file is not below the workspace path.
		if (!path.startsWith(trimmedWorkspacePath)) {
			return false;
		}

		if (!this.workspace.recursive) {
			const pathElements = path.split("/").slice(0, -1);
			const workspacePathElements = trimmedWorkspacePath
				.split("/")
				.filter((el) => el);

			return pathElements.join("/") === workspacePathElements.join("/");
		}

		return true;
	}
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

			const filteredValues = Object.fromEntries(
				Object.entries(values).filter(([_, value]) => !!value)
			);

			filteredValues["path"] = file.path;
			filteredValues["name"] = file.basename;

			records.push(standardizeRecord(file.path, filteredValues));
		}
	}

	return records;
}

export function detectSchema(records: DataRecord[]): DataField[] {
	return detectFields(records)
		.map((field) =>
			field.name === "name" || field.name === "path"
				? { ...field, derived: true }
				: field
		)
		.map((field) =>
			field.name === "path" ? { ...field, identifier: true } : field
		);
}
