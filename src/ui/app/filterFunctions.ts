import produce from "immer";
import dayjs from "dayjs";
import {
  type DataFrame,
  type DataRecord,
  type DataValue,
  type Optional,
  isOptionalString,
  isOptionalNumber,
  isOptionalBoolean,
  isOptionalDate,
} from "src/lib/dataframe/dataframe";
import { isOptionalList } from "src/lib/dataframe/dataframe";
import {
  isBooleanFilterOperator,
  isNumberFilterOperator,
  isStringFilterOperator,
  isDateFilterOperator,
  isListFilterOperator,
  type BaseFilterOperator,
  type BooleanFilterOperator,
  type FilterCondition,
  type FilterDefinition,
  type NumberFilterOperator,
  type StringFilterOperator,
  type DateFilterOperator,
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


  if (isOptionalString(value) && isStringFilterOperator(operator)) {
    return stringFns[operator](value, cond.value);
  } else if (isOptionalNumber(value) && isNumberFilterOperator(operator)) {
    return numberFns[operator](
      value,
      cond.value ? parseFloat(cond.value) : undefined
    );
  } else if (isOptionalBoolean(value) && isBooleanFilterOperator(operator)) {
    return booleanFns[operator](value);
  } else if (isOptionalDate(value) && isDateFilterOperator(operator)) {
    return dateFns[operator](
      value,
      cond.value ? dayjs(cond.value ?? "").toDate() : undefined
    );

  if (isOptionalList(value)) {
    if (isListFilterOperator(operator)) {
      return listFns[operator](
        value ?? [],
        cond.value ? JSON.parse(cond.value ?? "[]") : undefined
      );
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
  (left: Optional<string>, right?: string) => boolean
> = {
  is: (left, right) => (left ? left == right : false),
  "is-not": (left, right) => (left ? left != right : true),
  contains: (left, right) => (left ? left.contains(right ?? "") : false),
  "not-contains": (left, right) => (left ? !left.contains(right ?? "") : true),
};

export const numberFns: Record<
  NumberFilterOperator,
  (left: Optional<number>, right?: number) => boolean
> = {
  eq: (left, right) => left === right,
  neq: (left, right) => left !== right,
  lt: (left, right) => (left && right ? left < right : false),
  gt: (left, right) => (left && right ? left > right : false),
  lte: (left, right) => (left && right ? left <= right : false),
  gte: (left, right) => (left && right ? left >= right : false),
};

export const booleanFns: Record<
  BooleanFilterOperator,
  (value: Optional<boolean>) => boolean
> = {
  "is-checked": (value) => value === true,
  "is-not-checked": (value) => value === false,
};

export const dateFns: Record<
  DateFilterOperator,
  (left: Optional<Date>, right?: Optional<Date>) => boolean
> = {
  "is-on": (left, right) => {
    return left && right ? left.getTime() == right.getTime() : false;
  },
  "is-not-on": (left, right) =>
    left && right ? left.getTime() != right.getTime() : true,
  "is-before": (left, right) =>
    left && right ? left.getTime() < right.getTime() : false,
  "is-after": (left, right) =>
    left && right ? left.getTime() > right.getTime() : false,
  "is-on-and-before": (left, right) =>
    left && right ? left.getTime() <= right.getTime() : false,
  "is-on-and-after": (left, right) =>
    left && right ? left.getTime() >= right.getTime() : false,

export const listFns: Record<
  ListFilterOperator,
  (left: Optional<DataValue>[], right?: Optional<DataValue>[]) => boolean
> = {
  "has-any-of": (left, right) => {
    return right ? right.some((value) => left.includes(value)) : false;
  },
  "has-all-of": (left, right) => {
    return right ? right.every((value) => left.includes(value)) : false;
  },
  "has-none-of": (left, right) => {
    return !(right ? right.some((value) => left.includes(value)) : false);
  },
};
