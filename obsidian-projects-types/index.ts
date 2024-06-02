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

export type Optional<T> =
  | T
  // undefined means the field has been removed from a DataRecord.
  | undefined
  // null means that while the field exists, it doesn't yet have a value.
  | null;

export class ViewApi {
  addRecord(
    record: DataRecord,
    fields: DataField[],
    templatePath: string
  ): void {}
  updateRecord(record: DataRecord, fields: DataField[]): void {}
  deleteRecord(recordId: string): void {}
  updateField(field: DataField): void {}
  deleteField(field: string): void {}
}

export type DataSource = FolderDataSource | TagDataSource | DataviewDataSource;

export type FolderDataSource = {
  readonly kind: "folder";
  readonly config: {
    readonly path: string;
    readonly recursive: boolean;
  };
};

export type TagDataSource = {
  readonly kind: "tag";
  readonly config: {
    readonly tag: string;
    readonly hierarchy: boolean;
  };
};

export type DataviewDataSource = {
  readonly kind: "dataview";
  readonly config: {
    readonly query: string;
  };
};

export type ProjectDefinition = {
  readonly name: string;
  readonly id: string;
  readonly defaultName: string;
  readonly templates: string[];
  readonly excludedNotes: string[];
  readonly isDefault: boolean;
  readonly dataSource: DataSource;
  readonly newNotesFolder: string;
};

export type DataQueryResult = {
  data: DataFrame;
};

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
