export interface FieldConfig {
	[key: string]: {
		width?: number;
		hide?: boolean;
	};
}

export interface GridConfig {
	fieldConfig?: FieldConfig;
	sortField?: string;
	sortAsc?: boolean;
}
