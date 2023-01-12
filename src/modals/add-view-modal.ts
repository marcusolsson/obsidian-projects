import { App, Modal } from "obsidian";
import type { ProjectDefinition, ViewDefinition } from "src/settings/settings";

import AddView from "./components/AddView.svelte";

export class AddViewModal extends Modal {
  component?: AddView;

  constructor(
    app: App,
    readonly project: ProjectDefinition,
    readonly onSave: (projectId: string, view: ViewDefinition) => void
  ) {
    super(app);
  }

  onOpen() {
    this.component = new AddView({
      target: this.contentEl,
      props: {
        project: this.project,
        onSave: (projectId: string, view: ViewDefinition) => {
          this.onSave(projectId, view);
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
