import { produce } from "immer";
import type { DataField, DataRecord } from "src/lib/dataframe/dataframe";
import { detectFields } from "src/lib/datasources/helpers";

export function detectSchema(records: DataRecord[]): DataField[] {
  return detectFields(records)
    .map((field) => ({ ...field, derived: true }))
    .map((field) =>
      field.name === "File"
        ? produce(field, (draft) => {
            draft.identifier = true;
            draft.typeConfig = produce(draft.typeConfig ?? {}, (draft) => {
              draft.richText = true;
            });
          })
        : field
    );
}
