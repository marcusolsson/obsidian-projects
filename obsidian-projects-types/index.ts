export interface Link {
  linkText: string;
  sourcePath: string;
}
export type DataValue =
  | string
  | number
  | boolean
  | Date
  | Link
  | Array<string>
  | undefined;
export interface DataRecord {
  readonly id: string;
  readonly values: Record<string, DataValue>;
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
export interface DataField {
  name: string;
  type: DataFieldType;
}
export interface DataFrame {
  fields: DataField[];
  records: DataRecord[];
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
  viewApi: ViewApi;
  project: ProjectDefinition;
  readonly: boolean;
  data: DataFrame;
}
export interface ProjectViewProps<T = Record<string, any>> {
  config: T;
  saveConfig: (config: T) => void;
  contentEl: HTMLElement;
}

export abstract class ProjectView<T = Record<string, any>> {
  async onData(result: DataQueryResult): Promise<void> {}
  async onOpen(props: ProjectViewProps<T>): Promise<void> {}
  async onClose(): Promise<void> {}
  abstract getViewType(): string;
  abstract getDisplayName(): string;
  abstract getIcon(): string;
}
