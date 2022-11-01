import type { DataFrame } from "./lib/data";
import type { ViewApi } from "./lib/view-api";
import type { ProjectDefinition } from "./types";

export interface DataQueryResult<T = Record<string, any>> {
  viewApi: ViewApi;
  project: ProjectDefinition;
  readonly: boolean;
  data: DataFrame;
}

export abstract class ProjectView<T = Record<string, any>> {
  // @ts-expect-error
  contentEl: HTMLElement;

  // @ts-expect-error
  saveConfig: (config: T) => void;

  async onData(result: DataQueryResult): Promise<void> {}
  async onOpen(config: T): Promise<void> {}
  async onClose(): Promise<void> {}

  abstract getViewType(): string;
  abstract getDisplayName(): string;
  abstract getIcon(): string;
}
