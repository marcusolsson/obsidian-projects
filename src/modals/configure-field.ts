import { App, Modal } from "obsidian";
import type { DataField } from "src/lib/data";

import ConfigureField from "./components/ConfigureField.svelte";

export class ConfigureFieldModal extends Modal {
  component?: ConfigureField;

  constructor(
    app: App,
    readonly title: string,
    readonly field: DataField,
    readonly onSave: (field: DataField) => void
  ) {
    super(app);
  }

  onOpen() {
    this.component = new ConfigureField({
      target: this.contentEl,
      props: {
        title: this.title,
        field: this.field,
        onSave: (field: DataField) => {
          this.onSave(field);
          this.close();
        },
      },
    });
  }

  onClose() {
    if (this.component) {
      this.component.$destroy();
    }
  }
}
