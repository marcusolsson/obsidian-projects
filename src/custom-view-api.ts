import type { DataFrame } from "src/lib/data";
import type { ViewApi } from "src/lib/view-api";
import type { ProjectDefinition } from "src/types";

export interface DataQueryResult {
  data: DataFrame;
}

export interface ProjectViewProps<T = Record<string, any>> {
  viewId: string;
  project: ProjectDefinition;
  config: T;
  saveConfig: (config: T) => void;
  contentEl: HTMLElement;
  viewApi: ViewApi;
  readonly: boolean;
}

export abstract class ProjectView<T = Record<string, any>> {
  async onData(result: DataQueryResult): Promise<void> {}
  async onOpen(props: ProjectViewProps<T>): Promise<void> {}
  async onClose(): Promise<void> {}

  abstract getViewType(): string;
  abstract getDisplayName(): string;
  abstract getIcon(): string;
}
