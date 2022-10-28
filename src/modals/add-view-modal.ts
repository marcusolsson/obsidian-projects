import { App, Modal } from "obsidian";
import AddView from "./components/AddView.svelte";
import type { ViewDefinition, ProjectDefinition } from "../types";

export class AddViewModal extends Modal {
  // @ts-ignore
  component: AddView;

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
