export type ViewType = string;

export interface ViewDefinition {
	name: string;
	id: string;
	type: ViewType;
	config: Record<string, any>;
}

export interface WorkspaceDefinitionV0 {
	name: string;
	id: string;
	path: string;
	recursive: boolean;
	views: ViewDefinition[];
	defaultName?: string;
	templates?: string[];
	dataview?: boolean;
	query?: string;
}

export interface ProjectDefinition extends WorkspaceDefinitionV0 {}
