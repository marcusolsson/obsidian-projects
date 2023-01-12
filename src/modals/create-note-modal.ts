import moment from "moment";
import { App, Modal } from "obsidian";
import { get } from "svelte/store";

import { nextUniqueFileName } from "src/lib/helpers";
import { i18n } from "src/lib/stores/i18n";
import { interpolateTemplate } from "src/lib/templates";
import type { ProjectDefinition } from "src/types";

import CreateNote from "./components/CreateNote.svelte";

export class CreateNoteModal extends Modal {
  component?: CreateNote;

  constructor(
    app: App,
    readonly project: ProjectDefinition,
    readonly onSave: (
      name: string,
      templatePath: string,
      project: ProjectDefinition
    ) => void
  ) {
    super(app);
  }

  onOpen() {
    this.component = new CreateNote({
      target: this.contentEl,
      props: {
        name: this.project.defaultName
          ? interpolateTemplate(this.project.defaultName, {
              date: (format) => moment().format(format || "YYYY-MM-DD"),
              time: (format) => moment().format(format || "HH:mm"),
            })
          : nextUniqueFileName(
              this.project.newNotesFolder,
              get(i18n).t("modals.note.create.untitled")
            ),
        project: this.project,
        onSave: (
          name: string,
          templatePath: string,
          project: ProjectDefinition
        ) => {
          this.onSave(name, templatePath, project);
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
