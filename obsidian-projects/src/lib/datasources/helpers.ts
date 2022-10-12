import dayjs from "dayjs";
import {
	DataFieldType,
	type DataField,
	type DataRecord,
	type DataValue,
	type Link,
} from "../data";

/**
 * parseRecords parses the values for each record based on the detected field
 * types.
 *
 * If field types matches with the corresponding data types in the records,
 * this function does nothing.
 *
 * In the case where a field contains more than one data type, this function
 * tries to parse the value in each record to match the field type.
 *
 * For example, if the record contains { "weight": 12 }, and the field type is
 * DataFieldType.String, the resulting record has { "weight": "12"}.
 */
export function parseRecords(
	records: DataRecord[],
	fields: DataField[]
): DataRecord[] {
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
					if (typeof value !== "object") {
						record.values[field.name] = value?.toLocaleString();
					}
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

	const detectedTypes = Object.keys(result).filter(
		(type) => type !== DataFieldType.Unknown
	);

	if (detectedTypes.length === 1) {
		return detectedTypes[0] as DataFieldType;
	} else if (detectedTypes.length > 1) {
		return DataFieldType.String;
	} else {
		return DataFieldType.Unknown;
	}
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
