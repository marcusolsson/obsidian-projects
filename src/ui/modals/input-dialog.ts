import { App, Modal } from "obsidian";

import InputDialog from "./components/InputDialog.svelte";

export class InputDialogModal extends Modal {
  component?: InputDialog;

  constructor(
    app: App,
    readonly message: string,
    readonly cta: string,
    readonly onSubmit: (value: string) => void,
    readonly value?: string | undefined
  ) {
    super(app);
  }

  onOpen() {
    this.component = new InputDialog({
      target: this.contentEl,
      props: {
        message: this.message,
        cta: this.cta,
        value: this.value ?? "",
        onSubmit: (value: string) => {
          this.onSubmit(value);
          this.close();
        },
        onCancel: () => {
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
