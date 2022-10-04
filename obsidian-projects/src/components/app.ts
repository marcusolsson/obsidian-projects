import { get } from "svelte/store";
import { DataviewDataSource } from "../lib/datasources/dataview";
import { FrontMatterDataSource } from "../lib/datasources/frontmatter";

import type { DataSource } from "../lib/types";
import type { ProjectDefinition } from "../types";

import { app } from "../lib/stores/obsidian";
import { TFile, type TAbstractFile } from "obsidian";

export function resolveDataSource(project: ProjectDefinition): DataSource {
	if (project.dataview) {
		return new DataviewDataSource(project);
	}
	return new FrontMatterDataSource(get(app), project);
}

export function isFile(value: TAbstractFile | null): value is TFile {
	return value instanceof TFile;
}
