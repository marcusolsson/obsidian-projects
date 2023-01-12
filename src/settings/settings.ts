import { either } from "fp-ts";

export type ViewType = string;

export interface ViewDefinition {
  readonly name: string;
  readonly id: string;
  readonly type: ViewType;
  readonly config: Record<string, any>;
  readonly filter: FilterDefinition;
  readonly colors: ColorFilterDefinition;
}

export type UnsavedViewDefinition = Omit<
  ViewDefinition,
  "name" | "id" | "type"
>;

export const DEFAULT_VIEW: UnsavedViewDefinition = {
  config: {},
  filter: { conditions: [] },
  colors: { conditions: [] },
};

export interface FilterDefinition {
  readonly conditions: FilterCondition[];
}

export interface ColorFilterDefinition {
  readonly conditions: ColorRule[];
}

export interface ColorRule {
  color: string;
  condition: FilterCondition;
}

export type BaseFilterOperator = "is-empty" | "is-not-empty";

export type StringFilterOperator =
  | "is"
  | "is-not"
  | "contains"
  | "not-contains";

export function isStringFilterOperator(
  op: FilterOperator
): op is StringFilterOperator {
  return ["is", "is-not", "contains", "not-contains"].includes(op);
}

export type NumberFilterOperator = "eq" | "neq" | "lt" | "gt" | "lte" | "gte";

export function isNumberFilterOperator(
  op: FilterOperator
): op is NumberFilterOperator {
  return ["eq", "neq", "lt", "gt", "lte", "gte"].includes(op);
}

export type BooleanFilterOperator = "is-checked" | "is-not-checked";

export function isBooleanFilterOperator(
  op: FilterOperator
): op is BooleanFilterOperator {
  return ["is-checked", "is-not-checked"].includes(op);
}

export type FilterOperator =
  | BaseFilterOperator
  | StringFilterOperator
  | NumberFilterOperator
  | BooleanFilterOperator;

export type FilterOperatorType = "unary" | "binary";

export const filterOperatorTypes: Record<FilterOperator, FilterOperatorType> = {
  "is-empty": "unary",
  "is-not-empty": "unary",
  is: "binary",
  "is-not": "binary",
  contains: "binary",
  "not-contains": "binary",
  eq: "binary",
  neq: "binary",
  lt: "binary",
  gt: "binary",
  lte: "binary",
  gte: "binary",
  "is-checked": "unary",
  "is-not-checked": "unary",
};

export interface FilterCondition {
  readonly field: string;
  readonly operator: FilterOperator;
  readonly value?: string;
}

export type StringFieldConfig = {
  options?: string[];
  richText?: boolean;
};

export type FieldConfig = StringFieldConfig;

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
  };
};

export type DataviewDataSource = {
  readonly kind: "dataview";
  readonly config: {
    readonly query: string;
  };
};

export type ProjectDefinition = {
  readonly name: string;
  readonly id: string;

  readonly fieldConfig: { [field: string]: FieldConfig };
  readonly views: ViewDefinition[];
  readonly defaultName: string;
  readonly templates: string[];
  readonly excludedNotes: string[];
  readonly isDefault: boolean;
  readonly dataSource: FolderDataSource | TagDataSource | DataviewDataSource;
  readonly newNotesFolder: string;
};

export type UnsavedProjectDefinition = Omit<
  ProjectDefinition,
  "name" | "id" | "views"
>;

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
};
export type ProjectsPluginPreferences = {
  readonly projectSizeLimit: number;
  readonly frontmatter: {
    readonly quoteStrings: "PLAIN" | "QUOTE_DOUBLE";
  };
};

export type ProjectsPluginSettingsV1 = {
  readonly version: 1;
  readonly lastProjectId?: string | undefined;
  readonly lastViewId?: string | undefined;
  readonly projects: ProjectDefinition[];
  readonly preferences: ProjectsPluginPreferences;
};

export type ProjectsPluginSettings = ProjectsPluginSettingsV1;

export const DEFAULT_SETTINGS: ProjectsPluginSettings = {
  version: 1,
  projects: [],
  preferences: {
    projectSizeLimit: 1000,
    frontmatter: {
      quoteStrings: "PLAIN",
    },
  },
};
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
