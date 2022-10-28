import type { DataFrame } from "./lib/data";

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

export abstract class ProjectViewV2 {
  // @ts-expect-error
  containerEl: HTMLElement;

  async onData(data: DataFrame): Promise<void> {}
  async onOpen(): Promise<void> {}
  async onClose(): Promise<void> {}

  abstract getViewType(): string;
  abstract getDisplayName(): string;
  abstract getIcon(): string;
}
