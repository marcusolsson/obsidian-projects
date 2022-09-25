import { get } from "svelte/store";
import { DataviewDataSource } from "../lib/datasources/dataview";
import { FrontMatterDataSource } from "../lib/datasources/frontmatter";

import type { DataSource } from "../lib/types";
import type { WorkspaceDefinition } from "../types";

import { app } from "../lib/stores/obsidian";
import { TFile, type TAbstractFile } from "obsidian";

export function resolveDataSource(workspace: WorkspaceDefinition): DataSource {
	if (workspace.dataview) {
		return new DataviewDataSource(workspace);
	}
	return new FrontMatterDataSource(get(app), workspace);
}

export function isFile(value: TAbstractFile | null): value is TFile {
	return value instanceof TFile;
}
