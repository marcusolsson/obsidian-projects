import produce from "immer";
import { writable } from "svelte/store";

import {
	type DataSource,
	type DataFrame,
	type DataRecord,
	DataFieldType,
} from "../data";

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
					draft.records.push(record);
				})
			);
		},
		updateRecord(record: DataRecord) {
			update((state) =>
				produce(state, (draft) => {
					draft.records = draft.records.map((r) =>
						r.id === record.id ? record : r
					);
				})
			);
		},
		deleteRecord(id: string) {
			update((state) =>
				produce(state, (draft) => {
					draft.records = draft.records.filter(
						(record) => record.id !== id
					);
				})
			);
		},
		renameField(from: string, to: string) {
			update((state) =>
				produce(state, (draft) => {
					draft.fields = draft.fields.map((field) =>
						field.name === from
							? {
									...field,
									name: to,
							  }
							: field
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
		merge(frame: DataFrame) {
			update((existing) =>
				produce(existing, (draft) => {
					// Merge records.
					const recordSet = Object.fromEntries(
						existing.records.map((record) => [record.id, record])
					);
					frame.records.forEach((record) => {
						recordSet[record.id] = record;
					});
					draft.records = Object.values(recordSet);

					// Merge fields.
					frame.fields.forEach((newField) => {
						const existingField = existing.fields.find(
							(f) => f.name === newField.name
						);

						if (existingField) {
							if (existingField.type !== newField.type) {
								const existingFieldIndex =
									existing.fields.findIndex(
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
				})
			);
		},
	};
}
