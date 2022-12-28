import type { TFile } from "obsidian";
import type { ProjectDefinition } from "src/types";
import type { RecordError } from "./datasources/frontmatter/frontmatter";

/**
 * DataFrame is the core data structure that contains structured data for a
 * collection of notes.
 */
export interface DataFrame {
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
}

/**
 * DataField holds metadata for a value in DataRecord, for example a front
 * matter property.
 */
export interface DataField {
  /**
   * name references the a property (key) in the DataRecord values object.
   */
  readonly name: string;

  /**
   * type defines the data type for the field.
   */
  readonly type: DataFieldType;

  /**
   * userConfig defines user-defined field information.
   */
  readonly userConfig: Record<string, any>;

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
}

export enum DataFieldType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Date = "date",
  Link = "link",
  Unknown = "unknown",
}

export interface DataRecord {
  readonly id: string;
  readonly values: Record<string, Optional<DataValue>>;
}

export type DataValue =
  | string
  | number
  | boolean
  | Date
  | Link
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

export interface Link {
  readonly displayName?: string;
  readonly linkText: string;
  readonly fullPath?: string;
  readonly sourcePath: string;
}

export const emptyDataFrame: DataFrame = {
  records: [],
  fields: [],
};

/**
 * DataSource reads data frames from a project.
 */
export abstract class DataSource {
  readonly project: ProjectDefinition;

  constructor(project: ProjectDefinition) {
    this.project = project;
  }

  /**
   * queryAll returns a DataFrame with all records in the project.
   */
  abstract queryAll(): Promise<DataFrame>;

  /**
   * queryOne returns a DataFrame with a single record for the given file.
   *
   * @param fields contains existing fields, to be able to parse file into the existing schema.
   */
  abstract queryOne(file: TFile, fields: DataField[]): Promise<DataFrame>;

  /**
   * includes returns whether a path belongs to the current project.
   */
  abstract includes(path: string): boolean;

  /**
   * readonly returns whether the data source is read-only.
   *
   * Read-only data sources are typically derived records where the data
   * source can't determine the original names of the fields.
   */
  readonly(): boolean {
    return false;
  }
}

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

export function isLink(value: Optional<DataValue> | DataValue): value is Link {
  if (value && typeof value === "object") {
    return "linkText" in value && "sourcePath" in value;
  }
  return false;
}

export function isNumber(
  value: Optional<DataValue> | DataValue
): value is number {
  return typeof value === "number";
}

export function isDate(value: Optional<DataValue> | DataValue): value is Date {
  return value instanceof Date;
}

export function hasValue(value: Optional<DataValue>): value is DataValue {
  if (typeof value === null || typeof value === undefined) {
    return true;
  }
  return false;
}

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

export function isOptionalLink(
  value: Optional<DataValue>
): value is Optional<Link> {
  return isLink(value) || isOptional(value);
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

export interface DataFieldSelectConfig {
  options: string[];
}
