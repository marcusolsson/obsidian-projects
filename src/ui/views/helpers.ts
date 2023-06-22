import { getContext, setContext } from "svelte";
import {
  DataFieldType,
  type DataField,
  type DataRecord,
} from "../../lib/dataframe/dataframe";

export function fieldIcon(field: DataFieldType): string {
  switch (field) {
    case DataFieldType.String:
      return "text";
    case DataFieldType.Number:
      return "hash";
    case DataFieldType.Boolean:
      return "check";
    case DataFieldType.Date:
      return "calendar-days";
  }
  return "info";
}

export function fieldToSelectableValue(field: DataField): {
  label: string;
  value: string;
} {
  return {
    label: field.name,
    value: field.name,
  };
}

const getRecordColorKey = Symbol();

export function getRecordColorContext(): (record: DataRecord) => string | null {
  return getContext(getRecordColorKey);
}

export function setRecordColorContext(
  fn: (record: DataRecord) => string | null
) {
  setContext(getRecordColorKey, fn);
}
