import type { FieldConfig } from "src/settings/settings";
import type { RecordError } from "../datasources/frontmatter/datasource";

/**
 * DataFrame is the core data structure that contains structured data for a
 * collection of notes.
 */
export type DataFrame = {
  /**
   * fields defines the schema for the data frame. Each field describes the
   * values in each DataRecord.
   */
  readonly fields: DataField[];

  /**
   * records holds the data from each note.
   */
  readonly records: DataRecord[];

  readonly errors?: RecordError[];
};

/**
 * DataField holds metadata for a value in DataRecord, for example a front
 * matter property.
 */
export type DataField = {
  /**
   * name references the a property (key) in the DataRecord values object.
   */
  readonly name: string;

  /**
   * type defines the data type for the field.
   */
  readonly type: DataFieldType;

  /**
   * typeConfig defines user-defined field information.
   */
  readonly typeConfig?: FieldConfig;

  /**
   * repeated defines whether the field can have multiple values.
   */
  readonly repeated: boolean;

  /**
   * identifier defines whether this field identifies a DataRecord.
   */
  readonly identifier: boolean;

  /**
   * derived defines whether this field has been derived from another field.
   *
   * Since derived fields are computed from other fields, they can't be
   * modified.
   */
  readonly derived: boolean;
};

export enum DataFieldType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Date = "date",
  List = "multitext",
  Unknown = "unknown",
}

export type DataRecord = {
  readonly id: string;
  readonly values: Record<string, Optional<DataValue>>;
};

export type DataValue =
  | string
  | number
  | boolean
  | Date
  | Array<Optional<DataValue>>;

export function isOptionalDataValue(
  value: unknown
): value is Optional<DataValue> {
  switch (typeof value) {
    case "string":
      return true;
    case "number":
      return true;
    case "boolean":
      return true;
    default:
      return false;
  }
}

export function isRepeatedDataValue(
  value: unknown
): value is Array<Optional<DataValue>> {
  if (Array.isArray(value)) {
    return value.every(isOptionalDataValue);
  }
  return false;
}

export type Optional<T> =
  | T
  // undefined means the field has been removed from a DataRecord.
  | undefined
  // null means that while the field exists, it doesn't yet have a value.
  | null;

export const emptyDataFrame: DataFrame = {
  records: [],
  fields: [],
};

export function isBoolean(
  value: Optional<DataValue> | DataValue
): value is boolean {
  return typeof value === "boolean";
}

export function isString(
  value: Optional<DataValue> | DataValue
): value is string {
  return typeof value === "string";
}

export function isList(value: Optional<DataValue> | DataValue) {
  return Array.isArray(value);
}

export function isNumber(
  value: Optional<DataValue> | DataValue
): value is number {
  return typeof value === "number";
}

export function isDate(value: Optional<DataValue> | DataValue): value is Date {
  return value instanceof Date;
}

// export function hasValue(value: Optional<DataValue>): value is DataValue {
//   if (value === null || value === undefined) {
//     return true;
//   }
//   return false;
// }

export function isOptional<T>(value: unknown): value is Optional<T> {
  return value === null || value === undefined;
}

export function isOptionalBoolean(
  value: Optional<DataValue>
): value is Optional<boolean> {
  return isBoolean(value) || isOptional(value);
}

export function isOptionalString(
  value: Optional<DataValue>
): value is Optional<string> {
  return isString(value) || isOptional(value);
}

export function isOptionalList(
  value: Optional<DataValue>
): value is Optional<Array<Optional<DataValue>>> {
  return isList(value) || isOptional(value);
}

export function isOptionalNumber(
  value: Optional<DataValue>
): value is Optional<number> {
  return isNumber(value) || isOptional(value);
}

export function isOptionalDate(
  value: Optional<DataValue>
): value is Optional<Date> {
  return isDate(value) || isOptional(value);
}

export function isStringLink(value: any): boolean {
  if (isString(value)) {
    return /^\[\[(.*)\]\]$/.test(value);
  }
  return false;
}
