import { produce } from "immer";
import { DataFieldType, type DataField } from "src/lib/dataframe/dataframe";
import type {
  BaseFilterOperator,
  FilterDefinition,
  FilterOperator,
} from "src/settings/settings";

export function setField(filter: FilterDefinition, pos: number, field: string) {
  return produce(filter, (draft) => {
    draft.conditions = draft.conditions.map((cond, idx) =>
      idx !== pos
        ? cond
        : {
            ...cond,
            field,
            operator: "is-empty",
          }
    );
  });
}

export function setOperator(
  filter: FilterDefinition,
  pos: number,
  operator: FilterOperator
) {
  return produce(filter, (draft) => {
    draft.conditions = draft.conditions.map((cond, idx) =>
      idx !== pos ? cond : { ...cond, operator }
    );
  });
}

export function setValue(filter: FilterDefinition, pos: number, value: string) {
  return produce(filter, (draft) => {
    draft.conditions = draft.conditions.map((cond, idx) =>
      idx !== pos ? cond : { ...cond, value }
    );
  });
}

export function removeCondition(filter: FilterDefinition, pos: number) {
  return produce(filter, (draft) => {
    draft.conditions.splice(pos, 1);
  });
}

export function addCondition(filter: FilterDefinition, fields: DataField[]) {
  return produce(filter, (draft) => {
    draft.conditions.push({
      field: fields.at(0)?.name ?? "",
      operator: "is-not-empty",
      enabled: true,
    });
  });
}

export function getFieldByName(
  fields: DataField[],
  fieldName: string
): DataField | undefined {
  return fields.find((field) => field.name === fieldName);
}

export function getOperatorsByField(field: DataField): Array<{
  label: string;
  value: FilterOperator;
}> {
  const baseOperators: Array<{
    label: string;
    value: BaseFilterOperator;
  }> = [
    { label: "is not empty", value: "is-not-empty" },
    { label: "is empty", value: "is-empty" },
  ];

  if (field.repeated) {
    return [
      ...baseOperators,
      { label: "has any of", value: "has-any-of" },
      { label: "has all of", value: "has-all-of" },
      { label: "has none of", value: "has-none-of" },
      { label: "has keyword", value: "has-keyword" },
    ];
  }

  switch (field.type) {
    case DataFieldType.String:
      return [
        ...baseOperators,
        { label: "is", value: "is" },
        { label: "is not", value: "is-not" },
        { label: "contains", value: "contains" },
        { label: "does not contain", value: "not-contains" },
      ];
    case DataFieldType.Boolean:
      return [
        ...baseOperators,
        { label: "is checked", value: "is-checked" },
        { label: "is not checked", value: "is-not-checked" },
      ];
    case DataFieldType.Number:
      return [
        ...baseOperators,
        { label: "=", value: "eq" },
        { label: "≠", value: "neq" },
        { label: "<", value: "lt" },
        { label: ">", value: "gt" },
        { label: "≤", value: "lte" },
        { label: "≥", value: "gte" },
      ];
    case DataFieldType.Date:
      return [
        ...baseOperators,
        { label: "is on", value: "is-on" },
        { label: "is not on", value: "is-not-on" },
        { label: "is before", value: "is-before" },
        { label: "is after", value: "is-after" },
        { label: "is on and before", value: "is-on-and-before" },
        { label: "is on and after", value: "is-on-and-after" },
      ];
  }

  return baseOperators;
}
