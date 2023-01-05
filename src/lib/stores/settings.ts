import produce from "immer";
import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

import { notEmpty } from "src/lib/helpers";
import {
  DEFAULT_SETTINGS,
  type ProjectsPluginPreferences,
  type ProjectsPluginSettings,
} from "src/main";
import {
  DEFAULT_PROJECT,
  DEFAULT_VIEW,
  type ProjectDefinition,
  type UnsavedProjectDefinition,
  type UnsavedViewDefinition,
  type ViewDefinition,
} from "src/types";
import { either } from "fp-ts";

function createSettings() {
  const { set, update, subscribe } = writable<ProjectsPluginSettings>(
    Object.assign({}, DEFAULT_SETTINGS)
  );

  return {
    set,
    subscribe,
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
 * migrateSettings accepts the value from Plugin.loadData() and returns the most
 * recent settings. If needed, it applies any necessary migrations.
 */
export function migrateSettings(
  settings: any
): either.Either<Error, ProjectsPluginSettings> {
  if (!settings) {
    return either.right(Object.assign({}, DEFAULT_SETTINGS));
  }

  if ("version" in settings && typeof settings.version === "number") {
    // Apply defaults to any saved projects.
    if ("projects" in settings && Array.isArray(settings.projects)) {
      return either.tryCatch(() => {
        return {
          ...DEFAULT_SETTINGS,
          ...settings,
          projects: settings.projects.map(loadProject),
          preferences: Object.assign({}, DEFAULT_SETTINGS.preferences),
        };
      }, either.toError);
    }

    return either.right({
      ...DEFAULT_SETTINGS,
      ...settings,
    });
  }

  return either.left(new Error("Missing version"));
}

// loadProject returns a complete project definition, or throws an exception.
function loadProject(project: Partial<ProjectDefinition>): ProjectDefinition {
  const res: UnsavedProjectDefinition = {
    ...DEFAULT_PROJECT,
    ...project,
  };

  if ("name" in res && "id" in res) {
    const { name, id } = res;

    if (isString(name) && isString(id)) {
      if ("views" in res && Array.isArray(res.views)) {
        return { ...res, name, id, views: res.views.map(loadView) };
      }
      return { ...res, name, id, views: [] };
    }
  }

  throw new Error("Invalid project definition");
}

// loadProject returns a complete view definition, or throws an exception.
function loadView(view: Partial<ViewDefinition>): ViewDefinition {
  const res: UnsavedViewDefinition = {
    ...DEFAULT_VIEW,
    ...view,
  };

  if ("name" in res && "id" in res && "type" in res) {
    const { name, id, type } = res;

    if (isString(name) && isString(id) && isString(type)) {
      return { ...res, name, id, type };
    }
  }

  throw new Error("Invalid view definition");
}

const isString = (value: unknown): value is string => {
  return typeof value === "string";
};
