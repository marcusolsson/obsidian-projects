import produce from "immer";
import { TFile, type Plugin } from "obsidian";
import { get, writable } from "svelte/store";
import { app } from "./obsidian";

export function registerFileEvents(plugin: Plugin) {
	plugin.registerEvent(
		plugin.app.vault.on("create", (file) => {
			if (file instanceof TFile) {
				fileIndex.create(file);
			}
		})
	);

	plugin.registerEvent(
		plugin.app.vault.on("rename", (file, oldPath) => {
			if (file instanceof TFile) {
				fileIndex.rename(file, oldPath);
			}
		})
	);

	plugin.registerEvent(
		plugin.app.vault.on("delete", (file) => {
			if (file instanceof TFile) {
				fileIndex.delete(file.path);
			}
		})
	);

	plugin.registerEvent(
		plugin.app.metadataCache.on("changed", (file) => {
			if (file instanceof TFile) {
				fileIndex.create(file);
			}
		})
	);
}

export interface FileIndex {
	workspaceFilter: (path: string) => boolean;
	files: Record<string, TFile>;
}

function createFileIndex() {
	const { subscribe, set, update } = writable<FileIndex>({
		workspaceFilter: () => false,
		files: {},
	});

	return {
		subscribe,
		reindex: async (path: string, recursive: boolean): Promise<void> => {
			const workspaceFilter = createWorkspaceFilter(path, recursive);

			const files = Object.fromEntries(
				get(app)
					.vault.getMarkdownFiles()
					.filter((file) => workspaceFilter(file.path))
					.map((file) => [file.path, file])
			);

			set({
				workspaceFilter,
				files,
			});
		},
		create: (file: TFile) => {
			update((index) =>
				produce(index, (draft) => {
					if (index.workspaceFilter(file.path)) {
						draft.files[file.path] = file;
					}

					return draft;
				})
			);
		},
		delete: (path: string) => {
			update((index) =>
				produce(index, (draft) => {
					delete draft.files[path];
					return draft;
				})
			);
		},
		rename: (file: TFile, oldPath: string) => {
			update((index) =>
				produce(index, (draft) => {
					delete draft.files[oldPath];

					if (index.workspaceFilter(file.path)) {
						draft.files[file.path] = file;
					}

					return draft;
				})
			);
		},
	};
}

function createWorkspaceFilter(
	workspacePath: string,
	recursive: boolean
): (path: string) => boolean {
	return (path: string) => {
		const filePath = path;

		// No need to continue if file is not below the workspace path.
		if (!filePath.startsWith(workspacePath)) {
			return false;
		}

		if (!recursive) {
			const pathElements = filePath.split("/").slice(0, -1);
			const workspacePathElements = workspacePath
				.split("/")
				.filter((el) => el);

			return pathElements.join("/") === workspacePathElements.join("/");
		}

		return true;
	};
}

export const fileIndex = createFileIndex();
