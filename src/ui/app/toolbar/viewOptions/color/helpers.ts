import produce from "immer";
import { DataFieldType, type DataField } from "src/lib/dataframe/dataframe";
import { v4 as uuidv4 } from "uuid";
import type {
  BaseFilterOperator,
  ColorFilterDefinition,
  ColorRule,
  FilterOperator,
} from "src/settings/settings";
import { get } from "svelte/store";
import { app } from "src/lib/stores/obsidian";

export type ColorRuleWithId = ColorRule & { readonly id: string };

export function setColor(
  value: ColorFilterDefinition,
  pos: number,
  color: string
) {
  return produce(value, (draft) => {
    draft.conditions = draft.conditions.map((cond, idx) =>
      idx !== pos ? cond : { ...cond, color }
    );
  });
}

export function setField(
  value: ColorFilterDefinition,
  pos: number,
  field: string
) {
  return produce(value, (draft) => {
    draft.conditions = draft.conditions.map((cond, idx) =>
      idx !== pos
        ? cond
        : {
            ...cond,
            condition: {
              ...cond.condition,
              field,
              operator: "is-empty",
            },
          }
    );
  });
}
export function setOperator(
  value: ColorFilterDefinition,
  pos: number,
  operator: FilterOperator
) {
  return produce(value, (draft) => {
    draft.conditions = draft.conditions.map<ColorRule>((cond, idx) =>
      idx !== pos
        ? cond
        : {
            ...cond,
            condition: {
              ...cond.condition,
              operator,
            },
          }
    );
  });
}

export function withIds<T>(values: T[]): Array<T & { id: string }> {
  return values.map((cond) => ({ ...cond, id: uuidv4() }));
}

export function stripIds<T>(
  values: Array<T & { id: string }>
): Array<Omit<T, "id">> {
  return values.map((value) => {
    const { id, ...rest } = value;
    return rest;
  });
}

export function setValue(
  filter: ColorFilterDefinition,
  pos: number,
  value: string
) {
  return produce(filter, (draft) => {
    draft.conditions = draft.conditions.map((cond, idx) =>
      idx !== pos
        ? cond
        : {
            ...cond,
            condition: {
              ...cond.condition,
              value,
            },
          }
    );
  });
}

export function setEnabled(
  value: ColorFilterDefinition,
  pos: number,
  enabled: boolean
) {
  return produce(value, (draft) => {
    draft.conditions = draft.conditions.map((cond, idx) =>
      idx !== pos
        ? cond
        : {
            ...cond,
            condition: {
              ...cond.condition,
              enabled,
            },
          }
    );
  });
}

export function addCondition(
  filter: ColorFilterDefinition,
  fields: DataField[]
) {
  return produce(filter, (draft) => {
    draft.conditions.push({
      color: get(app).vault.config.accentColor ?? "#a882ff", // Obsidian purple
      condition: {
        field: fields.at(0)?.name ?? "",
        operator: "is-not-empty",
        enabled: true,
      },
    });
  });
}

export function removeCondition(filter: ColorFilterDefinition, pos: number) {
  return produce(filter, (draft) => {
    draft.conditions.splice(pos, 1);
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
