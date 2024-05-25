import { either } from "fp-ts";

import * as base from "./base/settings";
import * as v1 from "./v1/settings";
import * as v2 from "./v2/settings";

export * from "./base/settings";

// These types are backwards-compatible and does not yet need versioning.
export type ViewDefinition = base.ViewDefinition;
export type ProjectPreferences = base.ProjectsPluginPreferences;

// This defines the latest version of the project definition.
export type ProjectDefinition = v2.ProjectDefinition<ViewDefinition>;

// Defines the latest version of the plugin settings.
export type LatestProjectsPluginSettings = v2.ProjectsPluginSettings<
  ProjectDefinition,
  ProjectPreferences
>;

export const DEFAULT_SETTINGS = v2.DEFAULT_SETTINGS;
export const DEFAULT_PROJECT = v2.DEFAULT_PROJECT;
export const DEFAULT_VIEW = base.DEFAULT_VIEW;

/**
 * migrateSettings accepts the value from Plugin.loadData() and returns the most
 * recent settings. If needed, it applies any necessary migrations.
 */
export function migrateSettings(
  settings: any
): either.Either<Error, LatestProjectsPluginSettings> {
  if (!settings) {
    return either.right(Object.assign({}, v2.DEFAULT_SETTINGS));
  }

  if ("version" in settings && typeof settings.version === "number") {
    if (settings.version === 1) {
      return either.right(migrate(v1.resolve(settings)));
    } else if (settings.version === 2) {
      return either.right(v2.resolve(settings));
    } else {
      return either.left(new Error("Unknown settings version"));
    }
  }

  return either.left(new Error("Missing settings version"));
}

export function migrate(
  v1settings: v1.ProjectsPluginSettings<
    v1.ProjectDefinition<base.ViewDefinition>
  >
): LatestProjectsPluginSettings {
  return {
    version: 2,
    projects: v1settings.projects.map(migrateProject),
    archives: [],
    preferences: v1settings.preferences,
  };
}

function migrateProject(
  v1project: v1.ProjectDefinition<base.ViewDefinition>
): v2.ProjectDefinition<base.ViewDefinition> {
  const {
    name,
    id,
    fieldConfig,
    templates,
    defaultName,
    excludedNotes,
    isDefault,
    views,
  } = v1project;

  const common = {
    name,
    id,
    fieldConfig,
    defaultName,
    templates,
    excludedNotes,
    isDefault,
    views,
  };

  return {
    ...common,
    newNotesFolder: "",
    dataSource: migrateDataSource(v1project),
  };
}

function migrateDataSource(
  project: v1.ProjectDefinition<base.ViewDefinition>
): v2.DataSource {
  if (project.dataview) {
    return {
      kind: "dataview",
      config: {
        query: project.query,
      },
    };
  }

  return {
    kind: "folder",
    config: {
      path: project.path,
      recursive: project.recursive,
    },
  };
}
