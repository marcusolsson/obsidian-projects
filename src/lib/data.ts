import type { TFile } from "obsidian";
import type { ProjectDefinition } from "../types";

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
  List = "list",
  Unknown = "unknown",
}

export interface DataRecord {
  readonly id: string;
  readonly values: Record<string, DataValue>;
}

export type DataValue =
  | string
  | number
  | boolean
  | Date
  | Link
  | Array<string>
  | undefined;

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

export function isBoolean(value: DataValue): value is boolean {
  return typeof value === "boolean";
}

export function isString(value: DataValue): value is string {
  return typeof value === "string";
}

export function isLink(value: DataValue): value is Link {
  if (value && typeof value === "object") {
    return "linkText" in value && "sourcePath" in value;
  }
  return false;
}

export function isNumber(value: DataValue): value is number {
  return typeof value === "number";
}

export function isDate(value: DataValue): value is Date {
  return value instanceof Date;
}

export function isOptionalBoolean(
  value: DataValue
): value is boolean | undefined {
  return typeof value === "boolean" || value === undefined;
}

export function isOptionalString(
  value: DataValue
): value is string | undefined {
  return typeof value === "string" || value === undefined;
}

export function isOptionalLink(value: DataValue): value is Link | undefined {
  if (typeof value === "object") {
    return "linkText" in value && "sourcePath" in value;
  }
  return value === undefined;
}

export function isOptionalList(
  value: DataValue
): value is Array<string> | undefined {
  return Array.isArray(value) || value === undefined;
}

export function isOptionalNumber(
  value: DataValue
): value is number | undefined {
  return typeof value === "number" || value === undefined;
}

export function isOptionalDate(value: DataValue): value is Date | undefined {
  return value instanceof Date || value === undefined;
}

export function isRawLink(value: any): value is Array<Array<string>> {
  if (value && Array.isArray(value)) {
    if (value.length === 1) {
      const nextValue = value[0];

      if (nextValue && Array.isArray(nextValue)) {
        return nextValue.length === 1;
      }
    }
  }
  return false;
}
