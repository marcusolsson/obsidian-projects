import { App, Modal } from "obsidian";
import type { DataField } from "src/lib/dataframe/dataframe";
import type { BoardConfig } from "../types";
import BoardSettings from "./BoardSettings.svelte";

export class BoardSettingsModal extends Modal {
  component?: BoardSettings;

  constructor(
    app: App,
    readonly config: BoardConfig,
    readonly fields: DataField[],
    readonly onSave: (config: BoardConfig) => void
  ) {
    super(app);
  }

  onOpen(): void {
    const { contentEl } = this;

    this.component = new BoardSettings({
      target: contentEl,
      props: {
        config: this.config,
        fields: this.fields,
        onSave: (config: BoardConfig) => {
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
