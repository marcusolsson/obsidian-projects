export interface BoardConfig {
  readonly groupByField?: string;
  readonly priorityField?: string;
  readonly columnWidth?: number;
  readonly columns?: {
    [name: string]: {
      readonly weight: number;
    };
  };
  readonly includeFields?: string[];
}
