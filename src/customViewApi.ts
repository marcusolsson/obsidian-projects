import type { DataFrame, DataRecord } from "src/lib/dataframe/dataframe";
import type { ViewApi } from "src/lib/viewApi";
import type { ProjectDefinition, ViewId } from "./settings/settings";

export interface DataQueryResult {
  data: DataFrame;
  hasSort: boolean;
  hasFilter: boolean;
}

/**
 * ProjectViewProps provides various metadata for the views.
 */
export interface ProjectViewProps<T = Record<string, any>> {
  viewId: ViewId;
  project: ProjectDefinition;
  config: T;
  saveConfig: (config: T) => void;
  contentEl: HTMLElement;
  viewApi: ViewApi;
  readonly: boolean;
  getRecordColor: (record: DataRecord) => string | null;
  sortRecords: (records: ReadonlyArray<DataRecord>) => DataRecord[];
  getRecord: (id: string) => DataRecord | undefined;
}

/**
 * ProjectView is the base class for all Project views.
 *
 * If you want to create a new built-in view, you need to create a new class
 * that extends this one. Then you need to register it in
 * ProjectsView.getProjectViews().
 */
export abstract class ProjectView<T = Record<string, any>> {
  async onData(result: DataQueryResult): Promise<void> {}
  async onOpen(props: ProjectViewProps<T>): Promise<void> {}
  async onClose(): Promise<void> {}

  abstract getViewType(): string;
  abstract getDisplayName(): string;
  abstract getIcon(): string;
}
