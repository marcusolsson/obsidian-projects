import type { ProjectsPluginSettings } from "../../main";
import { writable } from "svelte/store";
import type {
	WorkspaceDefinition,
	ViewDefinition,
} from "obsidian-projects/src/types";
import produce from "immer";

function createSettings() {
	const { set, update, subscribe } = writable<ProjectsPluginSettings>({
		workspaces: [],
	});

	return {
		set,
		subscribe,
		saveLayout(workspaceId?: string, viewId?: string) {
			update((state) => {
				return produce(state, (draft) => {
					(draft.lastWorkspaceId = workspaceId),
						(draft.lastViewId = viewId);
					return draft;
				});
			});
		},
		addWorkspace(workspace: WorkspaceDefinition) {
			update((state) => {
				return produce(state, (draft) => {
					draft.workspaces.push(workspace);
					return draft;
				});
			});
		},
		updateWorkspace(workspace: WorkspaceDefinition) {
			update((state) => {
				return produce(state, (draft) => {
					draft.workspaces = draft.workspaces.map((w) =>
						w.id === workspace.id ? workspace : w
					);
					return draft;
				});
			});
		},
		deleteWorkspace(workspaceId: string) {
			update((state) => {
				return produce(state, (draft) => {
					draft.workspaces = draft.workspaces.filter(
						(w) => w.id !== workspaceId
					);
					return draft;
				});
			});
		},
		addView(workspaceId: string, view: ViewDefinition) {
			update((state) => {
				return produce(state, (draft) => {
					const idx = draft.workspaces.findIndex(
						(ws) => ws.id === workspaceId
					);

					if (idx >= 0) {
						const ws = draft.workspaces[idx];
						if (ws) {
							draft.workspaces.splice(idx, 1, {
								...ws,
								views: [...ws.views, view],
							});
						}
					}

					return draft;
				});
			});
		},
		renameView(workspaceId: string, viewId: string, name: string) {
			update((state) => {
				return produce(state, (draft) => {
					const idx = draft.workspaces.findIndex(
						(ws) => ws.id === workspaceId
					);

					if (idx >= 0) {
						const ws = draft.workspaces[idx];

						if (ws) {
							draft.workspaces.splice(idx, 1, {
								...ws,
								views: ws.views.map<ViewDefinition>((view) =>
									view.id === viewId
										? { ...view, name }
										: view
								),
							});
						}
					}

					return draft;
				});
			});
		},
		deleteView(workspaceId: string, viewId: string) {
			update((state) => {
				return produce(state, (draft) => {
					const idx = draft.workspaces.findIndex(
						(ws) => ws.id === workspaceId
					);

					if (idx >= 0) {
						const ws = draft.workspaces[idx];

						if (ws) {
							draft.workspaces.splice(idx, 1, {
								...ws,
								views: ws.views.filter(
									(view) => view.id !== viewId
								),
							});
						}
					}

					return draft;
				});
			});
		},
		updateViewConfig(
			workspaceId: string,
			viewId: string,
			config: Record<string, any>
		) {
			update((state) =>
				produce(state, (draft) => {
					draft.workspaces = draft.workspaces.map((workspace) => {
						if (workspace.id === workspaceId) {
							return {
								...workspace,
								views: workspace.views.map((view) => {
									if (view.id === viewId) {
										return {
											...view,
											config,
										};
									}
									return view;
								}),
							};
						}
						return workspace;
					});
					return draft;
				})
			);
		},
	};
}
export const settings = createSettings();
