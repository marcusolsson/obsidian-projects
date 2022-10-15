import {
	DEFAULT_SETTINGS,
	type ProjectsPluginSettings,
	type ProjectsPluginSettingsV1,
} from "../../main";
import { writable } from "svelte/store";
import type { ViewDefinition, ProjectDefinition } from "src/types";
import produce from "immer";

function createSettings() {
	const { set, update, subscribe } = writable<ProjectsPluginSettingsV1>({
		version: 1,
		projects: [],
	});

	return {
		set,
		subscribe,
		saveLayout(projectId?: string, viewId?: string) {
			update((state) => {
				return produce(state, (draft) => {
					(draft.lastProjectId = projectId),
						(draft.lastViewId = viewId);
					return draft;
				});
			});
		},
		addProject(project: ProjectDefinition) {
			update((state) => {
				return produce(state, (draft) => {
					draft.projects.push(project);
					return draft;
				});
			});
		},
		updateProject(project: ProjectDefinition) {
			update((state) => {
				return produce(state, (draft) => {
					draft.projects = draft.projects.map((w) =>
						w.id === project.id ? project : w
					);
					return draft;
				});
			});
		},
		deleteProject(projectId: string) {
			update((state) => {
				return produce(state, (draft) => {
					draft.projects = draft.projects.filter(
						(w) => w.id !== projectId
					);
					return draft;
				});
			});
		},
		addView(projectId: string, view: ViewDefinition) {
			update((state) => {
				return produce(state, (draft) => {
					const idx = draft.projects.findIndex(
						(ws) => ws.id === projectId
					);

					if (idx >= 0) {
						const ws = draft.projects[idx];
						if (ws) {
							draft.projects.splice(idx, 1, {
								...ws,
								views: [...ws.views, view],
							});
						}
					}

					return draft;
				});
			});
		},
		renameView(projectId: string, viewId: string, name: string) {
			update((state) => {
				return produce(state, (draft) => {
					const idx = draft.projects.findIndex(
						(p) => p.id === projectId
					);

					if (idx >= 0) {
						const p = draft.projects[idx];

						if (p) {
							draft.projects.splice(idx, 1, {
								...p,
								views: p.views.map<ViewDefinition>((view) =>
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
		deleteView(projectId: string, viewId: string) {
			update((state) => {
				return produce(state, (draft) => {
					const idx = draft.projects.findIndex(
						(ws) => ws.id === projectId
					);

					if (idx >= 0) {
						const ws = draft.projects[idx];

						if (ws) {
							draft.projects.splice(idx, 1, {
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
			projectId: string,
			viewId: string,
			config: Record<string, any>
		) {
			update((state) =>
				produce(state, (draft) => {
					draft.projects = draft.projects.map((project) => {
						if (project.id === projectId) {
							return {
								...project,
								views: project.views.map((view) => {
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
						return project;
					});
					return draft;
				})
			);
		},
	};
}
export const settings = createSettings();

/**
 * migrateAny accepts the value from Plugin.loadData() and returns the most
 * recent settings. If needed, it applies any necessary migrations.
 */
export function migrateAny(settings: any): ProjectsPluginSettingsV1 {
	if (!settings) {
		return { version: 1, projects: [] };
	}

	if ("version" in settings) {
		return Object.assign(
			{},
			DEFAULT_SETTINGS,
			settings as ProjectsPluginSettingsV1
		);
	}

	// If there's no version in the settings, then assume it's a pre-release (v0).
	return migrate(settings as ProjectsPluginSettings);
}

// migrate migrates settings version 0 to version 1.
function migrate(v0: ProjectsPluginSettings): ProjectsPluginSettingsV1 {
	return {
		version: 1,
		lastProjectId: v0.lastWorkspaceId,
		lastViewId: v0.lastViewId,
		projects: v0.workspaces,
	};
}
