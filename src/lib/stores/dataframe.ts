import produce, { castDraft, castImmutable } from "immer";
import { writable } from "svelte/store";

import {
  DataFieldType,
  type DataField,
  type DataFrame,
  type DataRecord,
  type DataSource,
} from "src/lib/data";

export const dataSource = writable<DataSource | undefined>();
export const dataFrame = createDataFrame();

function createDataFrame() {
  const { update, set, subscribe } = writable<DataFrame>({
    fields: [],
    records: [],
  });

  return {
    set,
    subscribe,
    addRecord(record: DataRecord) {
      update((state) =>
        produce(state, (draft) => {
          // @ts-ignore
          draft.records.push(record);
        })
      );
    },
    updateRecord(record: DataRecord) {
      update((state) =>
        produce(state, (draft) => {
          // @ts-ignore
          draft.records = castDraft(
            draft.records
              .map(castImmutable)
              // @ts-ignore
              .map((r) => (r.id === record.id ? record : r))
          );
        })
      );
    },
    deleteRecord(id: string) {
      update((state) =>
        produce(state, (draft) => {
          draft.records = draft.records.filter((record) => record.id !== id);
        })
      );
    },
    updateField(updated: DataField, oldName?: string) {
      update((state) =>
        produce(state, (draft) => {
          draft.fields = draft.fields
            .map((field) => (field.name === oldName ? updated : field))
            .filter((field) => field.name !== oldName);

          draft.records = draft.records.map((record) =>
            produce(record, (draft) => {
              if (oldName) {
                // @ts-ignore
                draft.values[updated.name] = draft.values[oldName];
                delete draft.values[oldName];
              }
            })
          );
        })
      );
    },
    deleteField(fieldName: string) {
      update((state) =>
        produce(state, (draft) => {
          draft.fields = draft.fields.filter(
            (field) => field.name !== fieldName
          );
        })
      );
    },
    merge(updated: DataFrame) {
      update((existing) => {
        const res = produce(existing, (draft) => {
          // Merge records.
          const recordSet = Object.fromEntries(
            existing.records.map((record) => [record.id, record])
          );
          updated.records.forEach((record) => {
            recordSet[record.id] = record;
          });
          draft.records = castDraft(Object.values(recordSet));

          // Merge fields.
          updated.fields.forEach((newField) => {
            const existingField = existing.fields.find(
              (f) => f.name === newField.name
            );

            if (existingField) {
              if (existingField.type !== newField.type) {
                const existingFieldIndex = existing.fields.findIndex(
                  (field) => field.name === newField.name
                );
                draft.fields[existingFieldIndex] = {
                  ...newField,
                  type: DataFieldType.String,
                };
              }
            } else {
              draft.fields.push(newField);
            }
          });

          draft.fields = draft.fields.filter((field) =>
            draft.records.some((record) => {
              // @ts-ignore
              return !!record.values[field.name];
            })
          );

          // Merge errors.
          const updatedIds = updated.records.map((record) => record.id);

          // Remove previously errored records.
          draft.errors =
            draft.errors?.filter((err) => !updatedIds.includes(err.recordId)) ??
            [];

          // Add new errors.
          draft.errors = [...draft.errors, ...(updated.errors ?? [])];
        });

        return res;
      });
    },
  };
}
