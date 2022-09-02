import produce from "immer";
import { TFile, type Plugin } from "obsidian";
import type { WorkspaceDefinition } from "src/main";
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

interface FileIndex {
	workspace?: WorkspaceDefinition;
	files: Record<string, TFile>;
}

function createFileIndex() {
	const { subscribe, set, update } = writable<FileIndex>({ files: {} });

	return {
		subscribe,
		reindex: (workspace: WorkspaceDefinition) => {
			const shouldIndex = createWorkspaceFilter(workspace);

			set({
				workspace,
				files: Object.fromEntries(
					get(app)
						.vault.getMarkdownFiles()
						.filter((file) => shouldIndex(file.path))
						.map((file) => [file.path, file])
				),
			});
		},
		create: (file: TFile) => {
			update((index) =>
				produce(index, (draft) => {
					const shouldIndex = index.workspace
						? createWorkspaceFilter(index.workspace)
						: () => false;

					if (shouldIndex(file.path)) {
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

					const shouldIndex = index.workspace
						? createWorkspaceFilter(index.workspace)
						: () => false;

					if (shouldIndex(file.path)) {
						draft.files[file.path] = file;
					}

					return draft;
				})
			);
		},
	};
}

function createWorkspaceFilter(
	workspace: WorkspaceDefinition
): (path: string) => boolean {
	return (path: string) => {
		const filePath = path;
		const workspacePath = workspace.path;

		// No need to continue if file is not below the workspace path.
		if (!filePath.startsWith(workspacePath)) {
			return false;
		}

		if (!workspace.recursive) {
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
