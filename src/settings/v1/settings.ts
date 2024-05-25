import {
  DEFAULT_VIEW,
  type FieldConfig,
  type ProjectId,
  type ProjectsPluginPreferences,
  type ViewDefinition,
} from "../base/settings";

export type ProjectDefinition<ViewDefinition> = {
  readonly name: string;
  readonly id: ProjectId;
  readonly path: string;
  readonly recursive: boolean;
  readonly fieldConfig: { [field: string]: FieldConfig };
  readonly views: ViewDefinition[];
  readonly defaultName: string;
  readonly templates: string[];
  readonly dataview: boolean;
  readonly query: string;
  readonly excludedNotes: string[];
  readonly isDefault: boolean;
};

export type ProjectsPluginSettings<ProjectDefinition> = {
  readonly version: 1;
  readonly lastProjectId?: string | undefined;
  readonly lastViewId?: string | undefined;
  readonly projects: ProjectDefinition[];
  readonly preferences: ProjectsPluginPreferences;
};

export const DEFAULT_SETTINGS: ProjectsPluginSettings<
  ProjectDefinition<ViewDefinition>
> = {
  version: 1,
  projects: [],
  preferences: {
    projectSizeLimit: 1000,
    frontmatter: {
      quoteStrings: "PLAIN",
    },
    locale: {
      firstDayOfWeek: "default",
    },
    commands: [],
    linkBehavior: "open-editor",
  },
};

export type UnsavedProjectDefinition = Omit<
  ProjectDefinition<ViewDefinition>,
  "name" | "id" | "views"
>;

export const DEFAULT_PROJECT: UnsavedProjectDefinition = {
  path: "",
  recursive: false,
  fieldConfig: {},
  defaultName: "",
  templates: [],
  dataview: false,
  query: "",
  excludedNotes: [],
  isDefault: false,
};

export type UnresolvedSettings = {
  readonly version: 1;
} & Partial<
  ProjectsPluginSettings<Partial<ProjectDefinition<Partial<ViewDefinition>>>>
>;

export function resolve(
  unresolved: UnresolvedSettings
): ProjectsPluginSettings<ProjectDefinition<ViewDefinition>> {
  return {
    ...DEFAULT_SETTINGS,
    ...unresolved,
    projects: unresolved.projects?.map(resolveProject) ?? [],
  };
}

function resolveProject(
  unresolved: Partial<ProjectDefinition<Partial<ViewDefinition>>>
): ProjectDefinition<ViewDefinition> {
  const { name, id } = unresolved;

  if (name && id) {
    return {
      ...DEFAULT_PROJECT,
      ...unresolved,
      name,
      id,
      views: unresolved.views?.map(resolveView) ?? [],
    };
  }

  throw new Error("Invalid project definition");
}

function resolveView(unresolved: Partial<ViewDefinition>): ViewDefinition {
  const { name, id, type } = unresolved;

  if (name && id && type) {
    return {
      ...DEFAULT_VIEW,
      ...unresolved,
      name,
      id,
      type,
    };
  }

  throw new Error("Invalid view definition");
}
