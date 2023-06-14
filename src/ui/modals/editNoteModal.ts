import { App, Modal } from "obsidian";

import type { DataField, DataRecord } from "src/lib/dataframe/dataframe";

import EditRecord from "./components/EditNote.svelte";

export class EditNoteModal extends Modal {
  component?: EditRecord;

  constructor(
    app: App,
    readonly fields: DataField[],
    readonly onSave: (record: DataRecord) => void,
    readonly defaults: DataRecord
  ) {
    super(app);
  }

  onOpen() {
    this.component = new EditRecord({
      target: this.contentEl,
      props: {
        record: this.defaults,
        fields: this.fields,
        onSave: (record: DataRecord) => {
          this.onSave(record);
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
