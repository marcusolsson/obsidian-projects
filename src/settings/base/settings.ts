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

export type DateFilterOperator =
  | "is-on"
  | "is-not-on"
  | "is-before"
  | "is-after"
  | "is-on-and-before"
  | "is-on-and-after";

export function isDateFilterOperator(
  op: FilterOperator
): op is DateFilterOperator {
  return [
    "is-on",
    "is-not-on",
    "is-before",
    "is-after",
    "is-on-and-before",
    "is-on-and-after",
  ].includes(op);
}

export type ListFilterOperator =
  | "has-any-of"
  | "has-all-of"
  | "has-none-of"
  | "has-keyword";

export function isListFilterOperator(
  op: FilterOperator
): op is ListFilterOperator {
  return ["has-any-of", "has-all-of", "has-none-of", "has-keyword"].includes(
    op
  );
}

export type FilterOperator =
  | BaseFilterOperator
  | StringFilterOperator
  | NumberFilterOperator
  | BooleanFilterOperator
  | DateFilterOperator
  | ListFilterOperator;

export type FilterOperatorType =
  | "unary"
  | "binary-text"
  | "binary-number"
  | "binary-date"
  | "binary-multitext";

export const filterOperatorTypes: Record<FilterOperator, FilterOperatorType> = {
  "is-empty": "unary",
  "is-not-empty": "unary",
  is: "binary-text",
  "is-not": "binary-text",
  contains: "binary-text",
  "not-contains": "binary-text",
  eq: "binary-number",
  neq: "binary-number",
  lt: "binary-number",
  gt: "binary-number",
  lte: "binary-number",
  gte: "binary-number",
  "is-checked": "unary",
  "is-not-checked": "unary",
  "is-on": "binary-date",
  "is-not-on": "binary-date",
  "is-before": "binary-date",
  "is-after": "binary-date",
  "is-on-and-before": "binary-date",
  "is-on-and-after": "binary-date",
  "has-any-of": "binary-multitext",
  "has-all-of": "binary-multitext",
  "has-none-of": "binary-multitext",
  "has-keyword": "binary-text",
};

export function getFilterOperatorType(
  op: FilterOperator | undefined
): FilterOperatorType | undefined {
  return op ? filterOperatorTypes[op] : undefined;
}

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

export type DateFieldConfig = {
  time?: boolean;
};

export type FieldConfig = StringFieldConfig & DateFieldConfig;

export type ShowCommand = {
  readonly project: string;
  readonly view?: string;
};

export type LinkBehavior = "open-note" | "open-editor";

export type FirstDayOfWeek = "sunday" | "monday" | "default";

export type ProjectsPluginPreferences = {
  readonly projectSizeLimit: number;
  readonly frontmatter: {
    readonly quoteStrings: "PLAIN" | "QUOTE_DOUBLE";
  };
  readonly locale: {
    firstDayOfWeek: FirstDayOfWeek;
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
  filter: { conjunction: "and", conditions: [] },
  colors: { conditions: [] },
  sort: { criteria: [] },
};
