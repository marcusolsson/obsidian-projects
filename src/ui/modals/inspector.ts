import { App, Modal } from "obsidian";
import type { RecordError } from "src/lib/datasources/frontmatter/datasource";

import Inspector from "./components/Inspector.svelte";

export class InspectorModal extends Modal {
  component?: Inspector;

  constructor(
    app: App,
    readonly title: string,
    readonly errors: RecordError[]
  ) {
    super(app);
  }

  onOpen() {
    this.component = new Inspector({
      target: this.contentEl,
      props: {
        title: this.title,
        errors: this.errors,
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
