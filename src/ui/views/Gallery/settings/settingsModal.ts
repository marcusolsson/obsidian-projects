import { App, Modal } from "obsidian";
import type { GalleryConfig } from "../types";
import GallerySettings from "./GallerySettings.svelte";

export class GallerySettingsModal extends Modal {
  component?: GallerySettings;

  constructor(
    app: App,
    readonly config: GalleryConfig,
    readonly onSave: (config: GalleryConfig) => void
  ) {
    super(app);
  }

  onOpen(): void {
    const { contentEl } = this;

    this.component = new GallerySettings({
      target: contentEl,
      props: {
        config: this.config,
        onSave: (config: GalleryConfig) => {
          this.onSave(config);
        },
      },
    });
  }

  onClose(): void {
    if (this.component) {
      this.component.$destroy();
    }
  }
}
