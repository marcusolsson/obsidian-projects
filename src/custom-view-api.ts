import type { DataFrame } from "./lib/data";
import type { ViewApi } from "./lib/view-api";

export abstract class ProjectViewV2<T = Record<string, any>> {
  // @ts-expect-error
  contentEl: HTMLElement;

  // @ts-expect-error
  viewApi: ViewApi;

  // @ts-expect-error
  saveConfig: (config: T) => void;

  async onData(data: DataFrame): Promise<void> {}
  async onOpen(config: T): Promise<void> {}
  async onClose(): Promise<void> {}

  abstract getViewType(): string;
  abstract getDisplayName(): string;
  abstract getIcon(): string;
}
