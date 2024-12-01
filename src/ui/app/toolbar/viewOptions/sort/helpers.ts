import { produce } from "immer";
import { DataFieldType, type DataField } from "src/lib/dataframe/dataframe";
import type { SortDefinition, SortOrder } from "src/settings/settings";

export function setField(value: SortDefinition, pos: number, field: string) {
  return produce(value, (draft) => {
    draft.criteria = draft.criteria.map((cond, idx) =>
      idx !== pos
        ? cond
        : {
            ...cond,
            field: field,
            order: "asc",
          }
    );
  });
}

export function setOrder(value: SortDefinition, pos: number, order: SortOrder) {
  return produce(value, (draft) => {
    draft.criteria = draft.criteria.map((cond, idx) =>
      idx !== pos ? cond : { ...cond, order }
    );
  });
}

export function setEnabled(
  value: SortDefinition,
  pos: number,
  enabled: boolean
) {
  return produce(value, (draft) => {
    draft.criteria = draft.criteria.map((cond, idx) =>
      idx !== pos ? cond : { ...cond, enabled }
    );
  });
}

export function addCriterium(value: SortDefinition, fields: DataField[]) {
  return produce(value, (draft) => {
    draft.criteria.push({
      field: fields.at(0)?.name ?? "",
      order: "asc",
      enabled: true,
    });
  });
}

export function removeCriterium(value: SortDefinition, pos: number) {
  return produce(value, (draft) => {
    draft.criteria.splice(pos, 1);
  });
}

export function getFieldByName(
  fields: DataField[],
  fieldName: string
): DataField | undefined {
  return fields.find((field) => field.name === fieldName);
}

export function getOrderByField(field: DataField): Array<{
  label: string;
  value: SortOrder;
}> {
  switch (field.type) {
    case DataFieldType.String:
      return [
        { label: "A → Z", value: "asc" },
        { label: "Z → A", value: "desc" },
      ];
    case DataFieldType.Number:
      return [
        { label: "1 → 9", value: "asc" },
        { label: "9 → 1", value: "desc" },
      ];
    case DataFieldType.Boolean:
      return [
        { label: "False → True", value: "asc" },
        { label: "True → False", value: "desc" },
      ];
    case DataFieldType.Date:
      return [
        { label: "Oldest → Newest", value: "asc" },
        { label: "Newest → Oldest", value: "desc" },
      ];
    default:
      return [
        { label: "Asc", value: "asc" },
        { label: "Desc", value: "desc" },
      ];
  }
}
