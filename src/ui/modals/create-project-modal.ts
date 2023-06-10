import { App, Modal } from "obsidian";
import type { ProjectDefinition } from "src/settings/settings";

import CreateProject from "./components/CreateProject.svelte";

export class CreateProjectModal extends Modal {
  component?: CreateProject;

  constructor(
    app: App,
    readonly title: string,
    readonly cta: string,
    readonly onSave: (project: ProjectDefinition) => void,
    readonly defaults: ProjectDefinition
  ) {
    super(app);
  }

  onOpen() {
    this.component = new CreateProject({
      target: this.contentEl,
      props: {
        title: this.title,
        cta: this.cta,
        project: this.defaults,
        onSave: (project: ProjectDefinition) => {
          this.onSave(project);
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
