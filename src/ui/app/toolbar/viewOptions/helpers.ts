import type { DataField } from "src/lib/dataframe/dataframe";

export type SelectOption = { label: string; value: string };

export function fieldsToSelectOptions(fields: DataField[]): SelectOption[] {
  return fields.map((field) => ({
    label: field.name,
    value: field.name,
  }));
}
