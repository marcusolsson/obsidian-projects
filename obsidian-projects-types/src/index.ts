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
	name: string;
	path: string;
	values: Record<string, DataValue>;
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

export interface ProjectView {
	setTitle(title: string): ProjectView;
	setIcon(icon: string): ProjectView;
	setNoPadding(): ProjectView;
	setOnOpen(cb: (data: any, contentEl: HTMLElement) => void): ProjectView;
}

export abstract class ProjectViewV2 {
	// @ts-expect-error
	containerEl: HTMLElement;

	protected async onData(data: DataFrame): Promise<void> {}
	protected async onOpen(): Promise<void> {}
	protected async onClose(): Promise<void> {}

	abstract getViewType(): string;
	abstract getDisplayName(): string;
	abstract getIcon(): string;
}
