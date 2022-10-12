import produce from "immer";
import {
	DataFieldType,
	isDate,
	isLink,
	type DataField,
	type DataRecord,
	type DataValue,
} from "../data";

export function detectFields(records: DataRecord[]): DataField[] {
	const valuesByField: Record<string, DataValue[]> = {};

	records.forEach((record) => {
		Object.entries(record.values).forEach(([field, value]) => {
			valuesByField[field] = [...(valuesByField[field] ?? []), value];
		});
	});

	return Object.entries(valuesByField).map<DataField>(([field, values]) => {
		return {
			name: field,
			type: typeFromValues(values),
			identifier: false,
			derived: false,
		};
	});
}

// typeFromValues returns the field type for a collection of values. This is an
// incredibly naïve implementation that needs to be optimized.
function typeFromValues(values: DataValue[]): DataFieldType {
	if (values.every((value) => typeof value === "string")) {
		return DataFieldType.String;
	}
	if (values.every((value) => typeof value === "number")) {
		return DataFieldType.Number;
	}
	if (values.every((value) => typeof value === "boolean")) {
		return DataFieldType.Boolean;
	}
	if (values.every((value) => isDate(value))) {
		return DataFieldType.Date;
	}
	if (values.every((value) => isLink(value))) {
		return DataFieldType.Link;
	}
	if (values.every((value) => Array.isArray(value))) {
		return DataFieldType.List;
	}
	if (values.every((value) => value === "null" || value === "undefined")) {
		return DataFieldType.Unknown;
	}
	if (values.some((value) => typeof value === "object")) {
		return DataFieldType.Unknown;
	}
	return DataFieldType.String;
}

// stringFallback converts a field to strings. Used when multiple data types are
// detected in the same field.
export function stringFallback(
	records: DataRecord[],
	field: string
): DataRecord[] {
	return produce(records, (draft) => {
		draft.forEach((record, i) => {
			const value = record.values[field];

			if (value) {
				record.values[field] = value.toString();
			}

			draft[i] = record;
		});
	});
}
