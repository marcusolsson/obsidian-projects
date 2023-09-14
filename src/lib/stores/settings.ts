import produce from "immer";
import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

import { i18n } from "src/lib/stores/i18n";
import { get } from "svelte/store";

import {
  nextUniqueProjectName,
  nextUniqueViewName,
  notEmpty,
} from "src/lib/helpers";
import {
  DEFAULT_SETTINGS,
  type ProjectDefinition,
  type ProjectId,
  type ProjectsPluginPreferences,
  type ProjectsPluginSettings,
  type ViewDefinition,
  type ViewId,
} from "src/settings/settings";

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
    duplicateProject(projectId: ProjectId) {
      const newId = uuidv4();
      update((state) =>
        produce(state, (draft) => {
          const project = draft.projects.find((p) => p.id === projectId);

          if (project) {
            draft.projects.push({
              ...project,
              id: newId,
              name: nextUniqueProjectName(
                draft.projects,
                project.name +
                  " " +
                  get(i18n).t("modals.project.duplicate.suffix")
              ),
              views: project.views.map((v) => ({ ...v, id: uuidv4() })),
            });
          }
        })
      );
      return newId;
    },
    deleteProject(projectId: ProjectId) {
      update((state) =>
        produce(state, (draft) => {
          draft.projects = draft.projects.filter((w) => w.id !== projectId);
        })
      );
    },
    addView(projectId: ProjectId, view: ViewDefinition) {
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
    sortViews(projectId: ProjectId, viewIds: string[]) {
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
    renameView(projectId: ProjectId, viewId: ViewId, name: string) {
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
    duplicateView(projectId: ProjectId, viewId: ViewId) {
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
                      name: nextUniqueViewName(
                        p.views,
                        view.name +
                          " " +
                          get(i18n).t("modals.view.duplicate.suffix")
                      ),
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
    deleteView(projectId: ProjectId, viewId: ViewId) {
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
    updateView(projectId: ProjectId, updatedView: ViewDefinition) {
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
      projectId: ProjectId,
      viewId: ViewId,
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
