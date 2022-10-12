import dayjs from "dayjs";
import {
	DataFieldType,
	type DataField,
	type DataRecord,
	type DataValue,
	type Link,
} from "../data";

/**
 * parseRecords parses each record based on the detected field type.
 */
export function parseRecords(records: DataRecord[], fields: DataField[]) {
	for (let field of fields) {
		for (let record of records) {
			const value = record.values[field.name];

			switch (field.type) {
				case DataFieldType.Date:
					if (typeof value === "string") {
						record.values[field.name] = dayjs(value).toDate();
					}
					break;
				case DataFieldType.List:
					if (typeof value === "string") {
						record.values[field.name] = [value];
					}
					break;
				case DataFieldType.Number:
					if (typeof value === "string") {
						record.values[field.name] = parseFloat(value);
					}
					break;
				case DataFieldType.Boolean:
					if (typeof value === "string") {
						record.values[field.name] = stringToBoolean(value);
					}
					break;
				case DataFieldType.String:
					record.values[field.name] = value?.toLocaleString();
					break;
			}
		}
	}
	return records;
}

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
	const types = values.map((value) => detectCellType(value));

	const result: Record<string, number> = {};

	for (let type of types) {
		if (!result[type]) {
			result[type] = 0;
		}
		result[type]++;
	}

	const dominantType = Object.entries(result).reduce(
		(acc, curr) => (curr[1] > acc[1] ? curr : acc),
		[DataFieldType.Unknown, 0]
	);

	return dominantType[0] as DataFieldType;
}

export function detectCellType(value: unknown): DataFieldType {
	// Standard types
	if (typeof value === "string") {
		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
			return DataFieldType.Date;
		}
		return DataFieldType.String;
	} else if (typeof value === "number") {
		return DataFieldType.Number;
	} else if (typeof value === "boolean") {
		return DataFieldType.Boolean;
	}

	// Class types
	if (isLink(value)) {
		return DataFieldType.Link;
	} else if (Array.isArray(value)) {
		return DataFieldType.List;
	}
	return DataFieldType.Unknown;
}

export function isLink(value: unknown): value is Link {
	if (value && typeof value === "object") {
		return "linkText" in value && "sourcePath" in value;
	}
	return false;
}

function stringToBoolean(stringValue: string): boolean {
	switch (stringValue?.toLowerCase()?.trim()) {
		case "true":
		case "yes":
		case "1":
			return true;

		case "false":
		case "no":
		case "0":
		case null:
		case undefined:
			return false;

		default:
			return !!stringValue;
	}
}
