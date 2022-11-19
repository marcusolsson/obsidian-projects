import { App, Modal } from "obsidian";
import type { CalendarConfig } from "../types";
import CalendarSettings from "./CalendarSettings.svelte";

export class CalendarSettingsModal extends Modal {
  component?: CalendarSettings;
  constructor(
    app: App,
    readonly config: CalendarConfig,
    readonly onSave: (config: CalendarConfig) => void
  ) {
    super(app);
  }
  onOpen(): void {
    const { contentEl } = this;

    this.component = new CalendarSettings({
      target: contentEl,
      props: {
        config: this.config,
        onSave: (config: CalendarConfig) => {
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
