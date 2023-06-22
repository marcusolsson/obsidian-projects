export interface BoardConfig {
  readonly groupByField?: string;
  readonly priorityField?: string;
  readonly columnWidth?: number;
  readonly columns?: ColumnSettings;
  readonly includeFields?: string[];
}

export interface ColumnSettings {
  [name: string]: {
    readonly weight?: number;
  };
}
