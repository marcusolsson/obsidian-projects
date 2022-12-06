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

export class ViewApi {
  addRecord(record: DataRecord, templatePath: string): void {}
  updateRecord(record: DataRecord, fields: DataField[]): void {}
  deleteRecord(recordId: string): void {}
  renameField(from: string, to: string): void {}
  deleteField(field: string): void {}
}
export interface ProjectDefinition {
  readonly name: string;
  readonly id: string;
  readonly path: string;
  readonly recursive: boolean;
  readonly defaultName?: string;
  readonly templates?: string[];
  readonly dataview?: boolean;
  readonly query?: string;
}

export interface DataQueryResult {
  data: DataFrame;
}

export interface ProjectViewProps<T = Record<string, any>> {
  viewId: string;
  project: ProjectDefinition;
  config: T;
  saveConfig: (config: T) => void;
  contentEl: HTMLElement;
  viewApi: ViewApi;
  readonly: boolean;
}

export abstract class ProjectView<T = Record<string, any>> {
  async onData(result: DataQueryResult): Promise<void> {}
  async onOpen(props: ProjectViewProps<T>): Promise<void> {}
  async onClose(): Promise<void> {}
  abstract getViewType(): string;
  abstract getDisplayName(): string;
  abstract getIcon(): string;
}
