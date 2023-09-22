import produce from "immer";
import type {
  DataFrame,
  DataRecord,
  DataValue,
  Optional,
} from "src/lib/dataframe/dataframe";
import { isOptionalList } from "src/lib/dataframe/dataframe";
import {
  isBooleanFilterOperator,
  isNumberFilterOperator,
  isStringFilterOperator,
  isListFilterOperator,
  type BaseFilterOperator,
  type BooleanFilterOperator,
  type FilterCondition,
  type FilterDefinition,
  type NumberFilterOperator,
  type StringFilterOperator,
  type ListFilterOperator,
} from "src/settings/settings";

export function matchesCondition(
  cond: FilterCondition,
  record: DataRecord
): boolean {
  const { operator } = cond;

  const value: Optional<DataValue> = record.values[cond.field];

  if (operator === "is-empty" || operator === "is-not-empty") {
    return baseFns[operator](value);
  }

  if (isOptionalList(value)) {
    if (isListFilterOperator(operator)) {
      return listFns[operator](value ?? [], cond.value);
    }
  }

  switch (typeof value) {
    case "string":
      if (isStringFilterOperator(operator)) {
        return stringFns[operator](value, cond.value);
      }
      break;
    case "number":
      if (isNumberFilterOperator(operator)) {
        return numberFns[operator](
          value,
          cond.value ? parseFloat(cond.value) : undefined
        );
      }
      break;
    case "boolean":
      if (isBooleanFilterOperator(operator)) {
        return booleanFns[operator](value);
      }
  }

  return false;
}

export function matchesFilterConditions(
  filter: FilterDefinition,
  record: DataRecord
) {
  const validConds = filter.conditions.filter((cond) => {
    return cond?.enabled ?? true;
  });
  return validConds.every((cond) => matchesCondition(cond, record));
}

export function applyFilter(
  frame: DataFrame,
  filter: FilterDefinition
): DataFrame {
  return produce(frame, (draft) => {
    draft.records = draft.records.filter((record) =>
      // @ts-ignore
      matchesFilterConditions(filter, record)
    );
  });
}

export const baseFns: Record<
  BaseFilterOperator,
  (value: Optional<DataValue>) => boolean
> = {
  "is-empty": (value) => value === undefined || value === null,
  "is-not-empty": (value) => value !== undefined && value !== null,
};

export const stringFns: Record<
  StringFilterOperator,
  (left: string, right?: string) => boolean
> = {
  is: (left, right) => left === right,
  "is-not": (left, right) => left !== right,
  contains: (left, right) => left.contains(right ?? ""),
  "not-contains": (left, right) => !left.contains(right ?? ""),
};

export const numberFns: Record<
  NumberFilterOperator,
  (left: number, right?: number) => boolean
> = {
  eq: (left, right) => left === right,
  neq: (left, right) => left !== right,
  lt: (left, right) => (right ? left < right : false),
  gt: (left, right) => (right ? left > right : false),
  lte: (left, right) => (right ? left <= right : false),
  gte: (left, right) => (right ? left >= right : false),
};

export const booleanFns: Record<
  BooleanFilterOperator,
  (value: boolean) => boolean
> = {
  "is-checked": (value) => value === true,
  "is-not-checked": (value) => value === false,
};

export const listFns: Record<
  ListFilterOperator,
  (left: Optional<DataValue>[], right?: string) => boolean
> = {
  "has-any-of": (left, right) => {
    const list = right?.split(",").map((value) => value.trim()) ?? [];
    return list.some((value) => left.includes(value));
  },
  "has-all-of": (left, right) => {
    const list = right?.split(",").map((value) => value.trim()) ?? [];
    return list.every((value) => left.includes(value));
  },
  "has-none-of": (left, right) => {
    const list = right?.split(",").map((value) => value.trim()) ?? [];
    return !list.some((value) => left.includes(value));
  },
};
