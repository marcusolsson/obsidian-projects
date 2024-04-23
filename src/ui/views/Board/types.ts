export interface BoardConfig {
  readonly groupByField?: string;
  readonly orderSyncField?: string;
  readonly columnWidth?: number;
  readonly columns?: ColumnSettings;
  readonly includeFields?: string[];
}

export interface ColumnSettings {
  [name: string]: {
    readonly weight?: number;
    readonly records?: string[];
    readonly collapse?: boolean;
    readonly pinned?: boolean;
  };
}
