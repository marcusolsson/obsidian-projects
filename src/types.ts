export type ViewType = string;

export interface ViewDefinition {
  readonly name: string;
  readonly id: string;
  readonly type: ViewType;
  readonly config: Record<string, any>;
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
  readonly query?: string;
}

export interface ProjectDefinition extends WorkspaceDefinitionV0 {}
