import type { DataFrame, DataRecord } from "src/lib/data";
import type { ViewApi } from "src/lib/view-api";
import type { ProjectDefinition, ViewId } from "./settings/settings";

export interface DataQueryResult {
  data: DataFrame;
}

export interface ProjectViewProps<T = Record<string, any>> {
  viewId: ViewId;
  project: ProjectDefinition;
  config: T;
  saveConfig: (config: T) => void;
  contentEl: HTMLElement;
  viewApi: ViewApi;
  readonly: boolean;
  getRecordColor: (record: DataRecord) => string | null;
}

export abstract class ProjectView<T = Record<string, any>> {
  async onData(result: DataQueryResult): Promise<void> {}
  async onOpen(props: ProjectViewProps<T>): Promise<void> {}
  async onClose(): Promise<void> {}

  abstract getViewType(): string;
  abstract getDisplayName(): string;
  abstract getIcon(): string;
}
