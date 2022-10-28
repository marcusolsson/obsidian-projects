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
      update((state) =>
        produce(state, (draft) => {
          draft.lastProjectId = projectId;
          draft.lastViewId = viewId;
        })
      );
    },
    addProject(project: ProjectDefinition) {
      update((state) =>
        produce(state, (draft) => {
          draft.projects.push(project);
        })
      );
    },
    updateProject(project: ProjectDefinition) {
      update((state) =>
        produce(state, (draft) => {
          draft.projects = draft.projects.map((w) =>
            w.id === project.id ? project : w
          );
        })
      );
    },
    deleteProject(projectId: string) {
      update((state) =>
        produce(state, (draft) => {
          draft.projects = draft.projects.filter((w) => w.id !== projectId);
        })
      );
    },
    addView(projectId: string, view: ViewDefinition) {
      update((state) =>
        produce(state, (draft) => {
          const idx = draft.projects.findIndex((ws) => ws.id === projectId);

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
        })
      );
    },
    renameView(projectId: string, viewId: string, name: string) {
      update((state) =>
        produce(state, (draft) => {
          const idx = draft.projects.findIndex((p) => p.id === projectId);

          if (idx >= 0) {
            const p = draft.projects[idx];

            if (p) {
              draft.projects.splice(idx, 1, {
                ...p,
                views: p.views.map<ViewDefinition>((view) =>
                  view.id === viewId ? { ...view, name } : view
                ),
              });
            }
          }
        })
      );
    },
    deleteView(projectId: string, viewId: string) {
      update((state) =>
        produce(state, (draft) => {
          const idx = draft.projects.findIndex((ws) => ws.id === projectId);

          if (idx >= 0) {
            const ws = draft.projects[idx];

            if (ws) {
              draft.projects.splice(idx, 1, {
                ...ws,
                views: ws.views.filter((view) => view.id !== viewId),
              });
            }
          }
        })
      );
    },
    updateView(projectId: string, updatedView: ViewDefinition) {
      update((state) =>
        produce(state, (draft) => {
          draft.projects = draft.projects.map((project) => {
            if (project.id === projectId) {
              return {
                ...project,
                views: project.views.map((view) => {
                  if (view.id === updatedView.id) {
                    return updatedView;
                  }
                  return view;
                }),
              };
            }
            return project;
          });
        })
      );
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
