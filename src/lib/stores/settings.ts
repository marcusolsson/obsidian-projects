import { produce, castImmutable } from "immer";
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
  type LatestProjectsPluginSettings,
  type FieldConfig,
  type ViewDefinition,
  type ViewId,
} from "src/settings/settings";

function createSettings() {
  const { set, update, subscribe } = writable<LatestProjectsPluginSettings>(
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
    archiveProject(projectId: ProjectId) {
      update((state) =>
        produce(state, (draft) => {
          const project = draft.projects.find((p) => p.id === projectId);
          if (project) draft.archives.push(project);
          draft.projects = draft.projects.filter((w) => w.id !== projectId);
        })
      );
    },
    restoreArchive(archiveId: ProjectId) {
      update((state) =>
        produce(state, (draft) => {
          const archive = draft.archives.find((a) => a.id === archiveId);
          if (archive) {
            draft.projects.push({
              ...archive,
              name: nextUniqueProjectName(draft.projects, archive.name),
            });
          }
          draft.archives = draft.archives.filter((w) => w.id !== archiveId);
        })
      );
    },
    deleteArchive(projectId: ProjectId) {
      update((state) =>
        produce(state, (draft) => {
          draft.archives = draft.archives.filter((w) => w.id !== projectId);
        })
      );
    },
    deleteProject(projectId: ProjectId) {
      update((state) =>
        produce(state, (draft) => {
          draft.projects = draft.projects.filter((w) => w.id !== projectId);
        })
      );
    },
    updateFieldConfig(
      projectId: ProjectId,
      fieldName: string,
      fields: string[],
      config: FieldConfig
    ) {
      update((state) =>
        produce(state, (draft) => {
          draft.projects = draft.projects.map((project) => {
            if (project.id === projectId) {
              if (project.fieldConfig) {
                Object.keys(castImmutable(project).fieldConfig)
                  .filter((k) => !fields.includes(k))
                  .forEach((k) => delete project.fieldConfig[k]);
              }

              return {
                ...project,
                fieldConfig: {
                  ...project.fieldConfig,
                  [fieldName]: config,
                },
              };
            }
            return project;
          });
        })
      );
    },
    deleteFieldConfig(projectId: ProjectId, fieldName: string) {
      update((state) =>
        produce(state, (draft) => {
          const project = draft.projects.find((p) => p.id === projectId);
          if (project) delete project.fieldConfig[fieldName];
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
