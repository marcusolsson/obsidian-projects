import { produce } from "immer";
import {
  type DataFrame,
  type DataRecord,
  type DataValue,
  type Optional,
  isNumber,
  isOptionalString,
  isOptionalNumber,
  isOptionalBoolean,
  isOptionalDate,
  isOptionalList,
} from "src/lib/dataframe/dataframe";
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
import { Temporal } from "temporal-polyfill";

export function matchesCondition(
  cond: FilterCondition,
  record: DataRecord
): boolean {
  const { operator } = cond;

  const value: Optional<DataValue> = record.values[cond.field];

  if (operator === "is-empty" || operator === "is-not-empty") {
    return baseFns[operator](value);
  }

  if (isOptionalList(value) && isListFilterOperator(operator)) {
    if (operator === "has-keyword") {
      return listFns[operator](value ?? [], cond.value);
    } else {
      return listFns[operator](
        value ?? [],
        cond.value ? JSON.parse(cond.value) : undefined
      );
    }
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
    let parsedValue = null; // TODO: extract to help functions / processing numbers
    if (cond.value) {
      try {
        // Attempt to parse as ZonedDateTime
        parsedValue = Temporal.ZonedDateTime.from(cond.value);
      } catch {
        try {
          // Attempt to parse as Instant and convert to ZonedDateTime
          parsedValue = Temporal.Instant.from(cond.value).toZonedDateTimeISO(
            cond.value
          );
        } catch {
          try {
            // Attempt to create ZonedDateTime using the current time and a PlainDate
            parsedValue = Temporal.PlainDateTime.from(
              cond.value
            ).toZonedDateTime(Temporal.Now.timeZoneId());
          } catch {
            parsedValue = null; // Default to null if all parsing fails
          }
        }
      }
    }
    return dateFns[operator](value, parsedValue ?? undefined);
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

  if (!validConds.length) return true;

  if (filter.conjunction === "or") {
    return validConds.some((cond) => matchesCondition(cond, record));
  }
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
  lt: (left, right) => isNumber(left) && isNumber(right) && left < right,
  gt: (left, right) => isNumber(left) && isNumber(right) && left > right,
  lte: (left, right) => isNumber(left) && isNumber(right) && left <= right,
  gte: (left, right) => isNumber(left) && isNumber(right) && left >= right,
};

export const booleanFns: Record<
  BooleanFilterOperator,
  (value: Optional<boolean>) => boolean
> = {
  "is-checked": (value) => value === true,
  "is-not-checked": (value) => value === false,
};

export const dateFns: Record<
  //TODO: handle datetime
  DateFilterOperator,
  (
    left: Optional<Temporal.ZonedDateTime>,
    right?: Optional<Temporal.ZonedDateTime>
  ) => boolean // TODO: refactor
> = {
  "is-on": (left, right) => {
    return left && right ? left.equals(right) : false;
  },
  "is-not-on": (left, right) =>
    left?.toPlainDate() && right?.toPlainDate()
      ? !left.toPlainDate().equals(right.toPlainDate())
      : true,
  "is-before": (left, right) =>
    left && right ? Temporal.PlainDate.compare(left, right) == -1 : false,
  "is-after": (left, right) =>
    left && right ? Temporal.PlainDate.compare(left, right) == 1 : false,
  "is-on-and-before": (left, right) =>
    left && right ? Temporal.PlainDate.compare(left, right) < 1 : false,
  "is-on-and-after": (left, right) =>
    left && right ? Temporal.PlainDate.compare(left, right) > -1 : false,
};

export const listFns_multitext: Record<
  Exclude<ListFilterOperator, "has-keyword">,
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

export const listFns_text: Record<
  "has-keyword",
  (left: Optional<DataValue>[], right?: string) => boolean
> = {
  "has-keyword": (left, right) => {
    return right
      ? left.some((value) => String(value).contains(String(right)))
      : false;
  },
};

export const listFns = {
  ...listFns_multitext,
  ...listFns_text,
};
