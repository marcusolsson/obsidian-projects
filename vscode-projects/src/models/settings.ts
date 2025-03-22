export type ProjectId = string;
export type ViewId = string;
export type ViewType = string;

/**
 * Definition of a view within a project
 */
export interface ViewDefinition {
  readonly name: string;
  readonly id: ViewId;
  readonly type: ViewType;
  readonly config: Record<string, any>;
  readonly filter: FilterDefinition;
  readonly colors: ColorFilterDefinition;
  readonly sort: SortDefinition;
}

/**
 * Sort configuration for views
 */
export interface SortDefinition {
  readonly criteria: SortingCriteria[];
}

export interface SortingCriteria {
  readonly field: string;
  readonly order: SortOrder;
  readonly enabled: boolean;
}

export type SortOrder = "asc" | "desc";

/**
 * Filter configuration for views
 */
export interface FilterDefinition {
  readonly conjunction?: "and" | "or";
  readonly conditions: FilterCondition[];
}

export interface ColorFilterDefinition {
  readonly conditions: ColorRule[];
}

export interface ColorRule {
  color: string;
  condition: FilterCondition;
}

export interface FilterCondition {
  readonly field: string;
  readonly operator: FilterOperator;
  readonly value?: string;
  readonly enabled: boolean;
}

export type FilterOperator =
  | "is-empty"
  | "is-not-empty"
  | "is"
  | "is-not"
  | "contains"
  | "not-contains"
  | "eq"
  | "neq"
  | "lt"
  | "gt"
  | "lte"
  | "gte"
  | "is-checked"
  | "is-not-checked"
  | "is-on"
  | "is-not-on"
  | "is-before"
  | "is-after"
  | "is-on-and-before"
  | "is-on-and-after"
  | "has-any-of"
  | "has-all-of"
  | "has-none-of"
  | "has-keyword";

/**
 * Data source types
 */
export type DataSource = FolderDataSource | TagDataSource | QueryDataSource;

export interface FolderDataSource {
  readonly kind: "folder";
  readonly config: {
    readonly path: string;
    readonly recursive: boolean;
  };
}

export interface TagDataSource {
  readonly kind: "tag";
  readonly config: {
    readonly tag: string;
    readonly hierarchy: boolean;
  };
}

export interface QueryDataSource {
  readonly kind: "query";
  readonly config: {
    readonly query: string;
  };
}

/**
 * Main project definition
 */
export interface ProjectDefinition {
  readonly name: string;
  readonly id: ProjectId;
  readonly fieldConfig: Record<string, FieldConfig>;
  readonly views: ViewDefinition[];
  readonly defaultName: string;
  readonly templates: string[];
  readonly excludedFiles: string[];
  readonly isDefault: boolean;
  readonly dataSource: DataSource;
  readonly newFilesFolder: string;
}

export interface FieldConfig {
  options?: string[];
  richText?: boolean;
  time?: boolean;
}

/**
 * User preferences for the extension
 */
export interface ProjectsExtensionPreferences {
  readonly projectSizeLimit: number;
  readonly frontmatter: {
    readonly quoteStrings: "PLAIN" | "QUOTE_DOUBLE";
  };
  readonly locale: {
    firstDayOfWeek: "sunday" | "monday" | "default";
  };
  readonly commands: ShowCommand[];
  readonly linkBehavior: "open-file" | "open-editor";
}

export interface ShowCommand {
  readonly project: string;
  readonly view?: string;
}

/**
 * Complete settings structure for the extension
 */
export interface ProjectsExtensionSettings {
  readonly projects: ProjectDefinition[];
  readonly archives: ProjectDefinition[];
  readonly preferences: ProjectsExtensionPreferences;
}

/**
 * Default values
 */
export const DEFAULT_VIEW: Omit<ViewDefinition, "name" | "id" | "type"> = {
  config: {},
  filter: { conjunction: "and", conditions: [] },
  colors: { conditions: [] },
  sort: { criteria: [] },
};

export const DEFAULT_PROJECT: Omit<ProjectDefinition, "name" | "id"> = {
  fieldConfig: {},
  defaultName: "",
  templates: [],
  excludedFiles: [],
  isDefault: false,
  dataSource: {
    kind: "folder",
    config: {
      path: "",
      recursive: false,
    },
  },
  newFilesFolder: "",
  views: [],
};

export const DEFAULT_SETTINGS: ProjectsExtensionSettings = {
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
