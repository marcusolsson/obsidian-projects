export interface BoardConfig {
  readonly groupByField?: string;
  readonly checkField?: string;
  readonly headerField?: string;
  readonly orderSyncField?: string;
  readonly pointsField?: string;
  readonly columnWidth?: number;
  readonly columns?: ColumnSettings;
  readonly includeFields?: string[];
}

export interface ColumnSettings {
  [name: string]: {
    readonly weight?: number;
    readonly records?: string[];
    readonly collapse?: boolean;
  };
}
