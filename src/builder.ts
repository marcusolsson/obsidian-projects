import type { DataFrame } from "./lib/data";
import type { ViewApi } from "./lib/view-api";

export interface ProjectView {
  setTitle(title: string): ProjectView;
  setIcon(icon: string): ProjectView;
  setNoPadding(): ProjectView;
  setOnOpen(cb: (data: any, contentEl: HTMLElement) => void): ProjectView;
}

export class Builder {
  title?: string;
  icon?: string;
  noPadding?: boolean;
  onOpen?: (data: any, contentEl: HTMLElement) => void;

  setTitle(title: string): Builder {
    this.title = title;
    return this;
  }

  setIcon(icon: string): Builder {
    this.icon = icon;
    return this;
  }

  setNoPadding() {
    this.noPadding = true;
    return this;
  }

  setOnOpen(cb: (data: any, contentEl: HTMLElement) => void) {
    this.onOpen = cb;
    return this;
  }
}

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
