import produce from "immer";
import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

import { notEmpty } from "src/lib/helpers";
import {
  DEFAULT_SETTINGS,
  type ProjectsPluginPreferences,
  type ProjectsPluginSettings,
  type ProjectsPluginSettingsV1,
} from "src/main";
import type { ProjectDefinition, ViewDefinition } from "src/types";

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
          // Can only have one default project.
          if (project.isDefault) {
            draft.projects = draft.projects.map((project) => ({
              ...project,
              isDefault: false,
            }));
          }
          draft.projects.push(project);
        })
      );
    },

    updatePreferences(prefs: ProjectsPluginPreferences) {
      update((state) =>
        produce(state, (draft) => {
          draft.preferences = prefs;
        })
      );
    },
    updateProject(project: ProjectDefinition) {
      update((state) =>
        produce(state, (draft) => {
          // Can only have one default project.
          if (project.isDefault) {
            draft.projects = draft.projects.map((project) => ({
              ...project,
              isDefault: false,
            }));
          }
          draft.projects = draft.projects.map((w) =>
            w.id === project.id ? project : w
          );
        })
      );
    },
    duplicateProject(projectId: string) {
      const newId = uuidv4();
      update((state) =>
        produce(state, (draft) => {
          const project = draft.projects.find((p) => p.id === projectId);

          if (project) {
            draft.projects.push({
              ...project,
              id: newId,
              name: project.name + " Copy",
              views: project.views.map((v) => ({ ...v, id: uuidv4() })),
            });
          }
        })
      );
      return newId;
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
    sortViews(projectId: string, viewIds: string[]) {
      update((state) =>
        produce(state, (draft) => {
          draft.projects = draft.projects.map((p) =>
            p.id !== projectId
              ? p
              : produce(p, (draft) => {
                  draft.views = viewIds
                    .map((id) => draft.views.find((v) => v.id === id))
                    .filter(notEmpty);
                })
          );
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
    duplicateView(projectId: string, viewId: string) {
      const newId = uuidv4();
      update((state) =>
        produce(state, (draft) => {
          const idx = draft.projects.findIndex((ws) => ws.id === projectId);

          if (idx >= 0) {
            const p = draft.projects[idx];
            if (p) {
              const view = p.views.find((v) => v.id === viewId);

              if (view) {
                draft.projects.splice(idx, 1, {
                  ...p,
                  views: [
                    ...p.views,
                    {
                      ...view,
                      id: newId,
                      name: view.name + " Copy",
                    },
                  ],
                });
              }
            }
          }

          return draft;
        })
      );
      return newId;
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
