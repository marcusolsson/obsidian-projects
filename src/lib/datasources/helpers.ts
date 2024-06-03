import dayjs from "dayjs";

import {
  DataFieldType,
  type DataField,
  type DataRecord,
  type DataValue,
  type Optional,
} from "../dataframe/dataframe";

/**
 * Parses the values for each record based on the detected field types.
 *
 * If field types matches with the corresponding data types in the records,
 * this function does nothing.
 *
 * In the case where a field contains more than one data type, this function
 * tries to parse the value in each record to match the field type.
 *
 * For example, if the record contains \{ "weight": 12 \}, and the field type is
 * DataFieldType.String, the resulting record has \{ "weight": "12" \}.
 */
export function parseRecords(
  records: DataRecord[],
  fields: DataField[]
): DataRecord[] {
  for (const field of fields) {
    for (const record of records) {
      const value = record.values[field.name];

      switch (field.type) {
        case DataFieldType.Date:
          if (typeof value === "string") {
            record.values[field.name] = dayjs(value).toDate();
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

/**
 * Merges a new version of `values` into a copy of data record.
 *
 * @param record - The original data record
 * @param values - The values to merge into the original record
 * @returns A new data record with the merged values
 */
export function updateRecordValues(
  record: Readonly<DataRecord>,
  values: Readonly<DataRecord["values"]>
): DataRecord {
  return { ...record, values: { ...record.values, ...values } };
}

export function detectFields(records: DataRecord[]): DataField[] {
  const valuesByField: Record<string, Optional<DataValue>[]> = {};

  records.forEach((record) => {
    Object.entries(record.values).forEach(([field, value]) => {
      valuesByField[field] = [...(valuesByField[field] ?? []), value];
    });
  });

  return Object.entries(valuesByField).map<DataField>(([field, values]) => ({
    name: field,
    type: typeFromValues(values),
    identifier: false,
    derived: false,
    repeated: values.some(Array.isArray),
    typeConfig: {},
  }));
}

// typeFromValues returns the field type for a collection of values. This is an
// incredibly naïve implementation that needs to be optimized.
function typeFromValues(values: Optional<DataValue>[]): DataFieldType {
  const types = values.map((value) => detectCellType(value));

  if (types.every((t) => t === DataFieldType.Unknown)) {
    return DataFieldType.String;
  }

  const result: Record<string, number> = {};

  for (const type of types) {
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
    if (
      /^\d{4}-\d{2}-\d{2}(T)?(\d{2})?(:\d{2})?(:\d{2})?(.\d{3})?$/.test(value)
    ) {
      return DataFieldType.Date;
    }
    return DataFieldType.String;
  } else if (typeof value === "number") {
    return DataFieldType.Number;
  } else if (typeof value === "boolean") {
    return DataFieldType.Boolean;
  }

  if (Array.isArray(value)) {
    return typeFromValues(value);
  }

  if (value === null) {
    return DataFieldType.Unknown;
  }

  return DataFieldType.Unknown;
}

/**
 * Converts a string to a boolean.
 *
 * @param str - The string to convert.
 * @returns The boolean representation of the string.
 */
function stringToBoolean(str: string): boolean {
  switch (str?.toLowerCase()?.trim()) {
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
      return !!str;
  }
}

/**
 * Thrown to avoid processing more files than the plugin can handle.
 */
export class TooManyNotesError extends Error {
  constructor(n: number, limit: number) {
    const message = `This project contains ${Intl.NumberFormat().format(
      n
    )} notes, which is more than the maximum project size (${Intl.NumberFormat().format(
      limit
    )}). You can increase the default limit in the plugin settings, but be aware that doing so may lead to a poor experience, or even cause the plugin to stop responding.`;

    super(message);

    this.name = "Too many notes";
  }
}
