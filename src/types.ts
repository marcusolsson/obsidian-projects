export type ViewType = string;

export interface ViewDefinition {
  readonly name: string;
  readonly id: string;
  readonly type: ViewType;
  readonly config: Record<string, any>;
  readonly filter?: FilterDefinition;
  readonly colors?: ColorFilterDefinition;
}

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
};

export type FieldConfig = StringFieldConfig;

export interface WorkspaceDefinitionV0 {
  readonly name: string;
  readonly id: string;
  readonly path: string;
  readonly recursive: boolean;
  readonly fieldConfig: { [field: string]: FieldConfig };
  readonly views: ViewDefinition[];
  readonly defaultName?: string;
  readonly templates?: string[];
  readonly dataview?: boolean;
  readonly query?: string;
  readonly excludedNotes?: string[];
  readonly isDefault?: boolean;
}

export interface ProjectDefinition extends WorkspaceDefinitionV0 {}
