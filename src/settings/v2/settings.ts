import type {
  FieldConfig,
  ProjectId,
  ProjectsPluginPreferences,
  ShowCommand,
  ViewDefinition,
} from "../base/settings";
import { DEFAULT_VIEW } from "../base/settings";

export type ProjectDefinition<ViewDefinition> = {
  readonly name: string;
  readonly id: ProjectId;

  readonly fieldConfig: { [field: string]: FieldConfig };
  readonly views: ViewDefinition[];
  readonly defaultName: string;
  readonly templates: string[];
  readonly excludedNotes: string[];
  readonly isDefault: boolean;
  readonly dataSource: DataSource;
  readonly newNotesFolder: string;
};

export type DataSource = FolderDataSource | TagDataSource | DataviewDataSource;

export type FolderDataSource = {
  readonly kind: "folder";
  readonly config: {
    readonly path: string;
    readonly recursive: boolean;
  };
};

export type TagDataSource = {
  readonly kind: "tag";
  readonly config: {
    readonly tag: string;
    readonly hierarchy: boolean;
  };
};

export type DataviewDataSource = {
  readonly kind: "dataview";
  readonly config: {
    readonly query: string;
  };
};

export type UnsavedProjectDefinition = Omit<
  ProjectDefinition<ViewDefinition>,
  "name" | "id"
>;

export type ProjectsPluginSettings<T, P> = {
  readonly version: 2;
  readonly projects: T[];
  readonly archives: T[];
  readonly preferences: P;
};

export const DEFAULT_PROJECT: UnsavedProjectDefinition = {
  fieldConfig: {},
  defaultName: "",
  templates: [],
  excludedNotes: [],
  isDefault: false,
  dataSource: {
    kind: "folder",
    config: {
      path: "",
      recursive: false,
    },
  },
  newNotesFolder: "",
  views: [],
};

export const DEFAULT_SETTINGS: ProjectsPluginSettings<
  ProjectDefinition<ViewDefinition>,
  ProjectsPluginPreferences
> = {
  version: 2,
  projects: [],
  archives: [],
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

export type UnresolvedSettings = {
  readonly version: 2;
} & Partial<
  ProjectsPluginSettings<
    Partial<ProjectDefinition<Partial<ViewDefinition>>>,
    Partial<ProjectsPluginPreferences>
  >
>;

export function resolve(
  unresolved: UnresolvedSettings
): ProjectsPluginSettings<
  ProjectDefinition<ViewDefinition>,
  ProjectsPluginPreferences
> {
  const projects = unresolved.projects?.map(resolveProject) ?? [];
  const archives = unresolved.archives?.map(resolveProject) ?? [];
  const preferences = resolvePreferences(unresolved.preferences ?? {});

  const commands = cleanUpCommands(preferences.commands, [
    ...projects,
    ...archives,
  ]);

  return {
    version: 2,
    projects,
    archives,
    preferences: {
      ...preferences,
      commands,
    },
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

export const DEFAULT_PREFERENCES: ProjectsPluginPreferences = {
  projectSizeLimit: 1000,
  frontmatter: {
    quoteStrings: "PLAIN",
  },
  locale: {
    firstDayOfWeek: "default",
  },
  commands: [],
  linkBehavior: "open-editor",
};

export function resolvePreferences(
  unresolved: Partial<ProjectsPluginPreferences>
): ProjectsPluginPreferences {
  return {
    ...DEFAULT_PREFERENCES,
    ...unresolved,
  };
}

const cleanUpCommands = (
  commands: ShowCommand[],
  allProjects: ProjectDefinition<ViewDefinition>[]
): ShowCommand[] => {
  const uniquified = removeDuplicateCommands(commands);
  return removeOrphanCommands(allProjects, uniquified);
};

const removeDuplicateCommands = (commands: ShowCommand[]): ShowCommand[] =>
  commands.filter(
    (cmd, index, self) =>
      index ===
      self.findIndex(
        (curr) => curr.project === cmd.project && curr.view === cmd.view
      )
  );

const removeOrphanCommands = (
  allProjects: ProjectDefinition<ViewDefinition>[],
  commands: ShowCommand[]
): ShowCommand[] =>
  commands.filter((cmd) =>
    allProjects.some(
      (project) =>
        project.id === cmd.project &&
        (!cmd.view || project.views.some((view) => view.id === cmd.view))
    )
  );
