import produce from "immer";
import { TFile, type Plugin, type TAbstractFile } from "obsidian";
import { writable } from "svelte/store";

export const files = writable<Record<string, TFile>>({});

export function registerFileEvents(plugin: Plugin) {
	plugin.registerEvent(plugin.app.vault.on("create", updateAbstractFile));
	plugin.registerEvent(plugin.app.vault.on("rename", updateAbstractFile));
	plugin.registerEvent(plugin.app.vault.on("delete", deleteAbstractFile));
	plugin.registerEvent(plugin.app.metadataCache.on("changed", updateFile));

	plugin.app.vault.getMarkdownFiles().forEach(updateFile);
}

const updateFile = (file: TFile) => {
	files.update((value) => {
		return produce(value, (draft) => {
			draft[file.path] = file;
			return draft;
		});
	});
};

const deleteFile = (file: TFile) => {
	files.update((value) => {
		return produce(value, (draft) => {
			delete draft[file.path];
			return draft;
		});
	});
};

const updateAbstractFile = (file: TAbstractFile) => {
	if (file instanceof TFile && file.extension === "md") {
		updateFile(file);
	}
};
const deleteAbstractFile = (file: TAbstractFile) => {
	if (file instanceof TFile && file.extension === "md") {
		deleteFile(file);
	}
};
