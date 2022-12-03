export type ViewType = string;

export interface ViewDefinition {
  readonly name: string;
  readonly id: string;
  readonly type: ViewType;
  readonly config: Record<string, any>;
}

export enum WorkspaceDataviewEnum {
  Query = "Query",
  JS = "JS",
}

export interface WorkspaceDefinitionV0 {
  readonly name: string;
  readonly id: string;
  readonly path: string;
  readonly recursive: boolean;
  readonly views: ViewDefinition[];
  readonly defaultName?: string;
  readonly templates?: string[];
  readonly dataview?: boolean;
  readonly dataviewType?: string;
  readonly query?: string;
  readonly jsQuery?: string;
  readonly excludedNotes?: string[];
}

export interface ProjectDefinition extends WorkspaceDefinitionV0 {}
