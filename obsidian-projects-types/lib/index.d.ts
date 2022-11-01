export interface Link {
    linkText: string;
    sourcePath: string;
}
export declare type DataValue = string | number | boolean | Date | Link | Array<string> | undefined;
export interface DataRecord {
    name: string;
    path: string;
    values: Record<string, DataValue>;
}
export declare enum DataFieldType {
    String = "string",
    Number = "number",
    Boolean = "boolean",
    Date = "date",
    Link = "link",
    List = "list",
    Unknown = "unknown"
}
export interface DataField {
    name: string;
    type: DataFieldType;
}
export interface DataFrame {
    fields: DataField[];
    records: DataRecord[];
}
export interface ProjectView {
    setTitle(title: string): ProjectView;
    setIcon(icon: string): ProjectView;
    setNoPadding(): ProjectView;
    setOnOpen(cb: (data: any, contentEl: HTMLElement) => void): ProjectView;
}
export declare abstract class ProjectViewV2 {
    containerEl: HTMLElement;
    protected onData(data: DataFrame): Promise<void>;
    protected onOpen(): Promise<void>;
    protected onClose(): Promise<void>;
    abstract getViewType(): string;
    abstract getDisplayName(): string;
    abstract getIcon(): string;
}
