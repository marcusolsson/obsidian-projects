export type ProjectId = string;
export type ViewId = string;

export type ViewType = string;

export interface ViewDefinition {
  readonly name: string;
  readonly id: ViewId;
  readonly type: ViewType;
  readonly config: Record<string, any>;
  readonly filter: FilterDefinition;
  readonly colors: ColorFilterDefinition;
  readonly sort: SortDefinition;
}

export interface SortDefinition {
  readonly criteria: SortingCriteria[];
}

export interface SortingCriteria {
  readonly field: string;
  readonly order: SortOrder;
  readonly enabled: boolean;
}

export type SortOrder = "asc" | "desc";

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
  readonly enabled: boolean;
}

export type StringFieldConfig = {
  options?: string[];
  richText?: boolean;
};

export type FieldConfig = StringFieldConfig;

export type ShowCommand = {
  readonly project: string;
  readonly view?: string;
};

export type LinkBehavior = "open-note" | "open-editor";

export type ProjectsPluginPreferences = {
  readonly projectSizeLimit: number;
  readonly frontmatter: {
    readonly quoteStrings: "PLAIN" | "QUOTE_DOUBLE";
  };
  readonly commands: ShowCommand[];
  readonly linkBehavior: LinkBehavior;
};

export type UnsavedViewDefinition = Omit<
  ViewDefinition,
  "name" | "id" | "type"
>;

export const DEFAULT_VIEW: UnsavedViewDefinition = {
  config: {},
  filter: { conditions: [] },
  colors: { conditions: [] },
  sort: { criteria: [] },
};
