import { get } from "svelte/store";
import { DataviewDataSource } from "../lib/datasources/dataview";
import { FrontMatterDataSource } from "../lib/datasources/frontmatter";

import type { DataSource } from "../lib/types";
import type { ProjectDefinition } from "../types";

import { app } from "../lib/stores/obsidian";
import { TFile, TFolder, Vault, type TAbstractFile } from "obsidian";

export function resolveDataSource(project: ProjectDefinition): DataSource {
	if (project.dataview) {
		return new DataviewDataSource(project);
	}
	return new FrontMatterDataSource(get(app), project);
}

export function isFile(value: TAbstractFile | null): value is TFile {
	return value instanceof TFile;
}

export function isFolder(value: TAbstractFile | null): value is TFolder {
	return value instanceof TFolder;
}

export function getFilesInFolder(folder: TFolder, recursive: boolean): TFile[] {
	const result: TFile[] = [];
	Vault.recurseChildren(folder, (file) => {
		if (file instanceof TFile) {
			result.push(file);
		}
	});
	return result;
}

export function getNotesInFolder(folder: TFolder, recursive: boolean): TFile[] {
	return getFilesInFolder(folder, recursive).filter(
		(file) => file.extension === "md"
	);
}

export function getFoldersInFolder(
	folder: TFolder,
	recursive: boolean
): TFolder[] {
	const result: TFolder[] = [];
	Vault.recurseChildren(folder, (file) => {
		if (file instanceof TFolder) {
			result.push(file);
		}
	});
	return result;
}

export function clickOutside(
	element: HTMLElement,
	callbackFunction: () => void
) {
	function onClick(event: any) {
		if (!element.contains(event.target)) {
			callbackFunction();
		}
	}

	document.body.addEventListener("click", onClick);

	return {
		update(newCallbackFunction: () => void) {
			callbackFunction = newCallbackFunction;
		},
		destroy() {
			document.body.removeEventListener("click", onClick);
		},
	};
}
