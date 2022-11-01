import type { DataFrame } from "./lib/data";
import type { ViewApi } from "./lib/view-api";
import type { ProjectDefinition } from "./types";

export interface DataQueryResult {
  viewApi: ViewApi;
  project: ProjectDefinition;
  readonly: boolean;
  data: DataFrame;
}

export interface ProjectViewProps<T = Record<string, any>> {
  config: T;
  saveConfig: (config: T) => void;
  contentEl: HTMLElement;
}

export abstract class ProjectView<T = Record<string, any>> {
  async onData(result: DataQueryResult): Promise<void> {}
  async onOpen(props: ProjectViewProps<T>): Promise<void> {}
  async onClose(): Promise<void> {}

  abstract getViewType(): string;
  abstract getDisplayName(): string;
  abstract getIcon(): string;
}
