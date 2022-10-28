import moment from "moment";
import { App, Modal } from "obsidian";
import { interpolateTemplate } from "../lib/templates";
import type { ProjectDefinition } from "../types";
import CreateNote from "./components/CreateNote.svelte";
import { i18n } from "../lib/stores/i18n";
import { get } from "svelte/store";
import { nextUniqueFileName } from "../lib/helpers";

export class CreateNoteModal extends Modal {
  // @ts-ignore
  component: CreateNote;

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
          ? interpolateTemplate(this.project.defaultName ?? "", {
              date: (format) => moment().format(format || "YYYY-MM-DD"),
              time: (format) => moment().format(format || "HH:mm"),
            })
          : nextUniqueFileName(
              this.project.path,
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
