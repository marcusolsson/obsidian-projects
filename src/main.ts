import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { addIcon, Plugin, TFolder, WorkspaceLeaf } from "obsidian";
import "obsidian-dataview";
import { get, type Unsubscriber } from "svelte/store";

import { createDataRecord, createProject } from "src/lib/data-api";
import { api } from "src/lib/stores/api";
import { i18n } from "src/lib/stores/i18n";
import { app, plugin } from "src/lib/stores/obsidian";
import { migrateAny, settings } from "src/lib/stores/settings";
import { CreateNoteModal } from "src/modals/create-note-modal";
import { CreateProjectModal } from "src/modals/create-project-modal";

import { registerFileEvents } from "./events";
import type { ProjectDefinition, WorkspaceDefinitionV0 } from "./types";
import { ProjectsView, VIEW_TYPE_PROJECTS } from "./view";

dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);

export interface ProjectsPluginSettings {
  readonly lastWorkspaceId?: string | undefined;
  readonly lastViewId?: string | undefined;
  readonly workspaces: WorkspaceDefinitionV0[];
}
export interface ProjectsPluginSettingsV1 {
  readonly version: number;
  readonly lastProjectId?: string | undefined;
  readonly lastViewId?: string | undefined;
  readonly projects: ProjectDefinition[];
}

export const DEFAULT_SETTINGS: Partial<ProjectsPluginSettingsV1> = {
  projects: [],
};

export default class ProjectsPlugin extends Plugin {
  unsubscribeSettings?: Unsubscriber;

  async onload() {
    const t = get(i18n).t;

    this.registerView(
      VIEW_TYPE_PROJECTS,
      (leaf) => new ProjectsView(leaf, this)
    );

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (file instanceof TFolder) {
          menu.addItem((item) => {
            item
              .setTitle(t("menus.project.create.title"))
              .setIcon("folder-plus")
              .onClick(async () => {
                const project = createProject();
                new CreateProjectModal(
                  this.app,
                  t("modals.project.create.title"),
                  t("modals.project.create.cta"),
                  settings.addProject,
                  {
                    ...project,
                    name: file.name,
                    path: file.path,
                  }
                ).open();
              });
          });
        }
      })
    );

    this.addCommand({
      id: "show-projects",
      name: t("commands.show-projects.name"),
      callback: () => {
        this.activateView();
      },
    });

    this.addCommand({
      id: "create-project",
      name: t("commands.create-project.name"),
      callback: () => {
        new CreateProjectModal(
          this.app,
          t("modals.project.create.title"),
          t("modals.project.create.cta"),
          settings.addProject,
          createProject()
        ).open();
      },
    });

    this.addCommand({
      id: "create-note",
      name: t("commands.create-note.name"),
      // checkCallback because we don't want to create notes if there are
      // no projects.
      checkCallback: (checking) => {
        const projectDefinition = get(settings).projects[0];

        if (projectDefinition) {
          if (!checking) {
            new CreateNoteModal(
              this.app,
              projectDefinition,
              async (name, templatePath, project) => {
                const file = await get(api).createNote(
                  createDataRecord(name, project),
                  templatePath
                );

                this.app.workspace.getLeaf(true).openFile(file);
              }
            ).open();
          }

          return true;
        }

        return false;
      },
    });

    this.addRibbonIcon("layout", "Open projects", () => {
      this.activateView();
    });

    addIcon(
      "text",
      `<g transform="matrix(1,0,0,1,2,2)"><path d="M20,32L28,32L28,24L41.008,24L30.72,72L20,72L20,80L52,80L52,72L42.992,72L53.28,24L68,24L68,32L76,32L76,16L20,16L20,32Z" /></g>`
    );

    // Initialize Svelte stores.
    app.set(this.app);
    plugin.set(this);
    settings.set(migrateAny(await this.loadData()));

    registerFileEvents(this);

    // Save settings to disk whenever settings has been updated.
    this.unsubscribeSettings = settings.subscribe((value) => {
      this.saveData(value);
    });
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_PROJECTS);

    this.unsubscribeSettings?.();
  }

  // activateView opens the main Projects view in a new workspace leaf.
  async activateView() {
    this.app.workspace.revealLeaf(await this.getOrCreateLeaf());
  }

  async getOrCreateLeaf(): Promise<WorkspaceLeaf> {
    const existingLeaves =
      this.app.workspace.getLeavesOfType(VIEW_TYPE_PROJECTS);

    if (existingLeaves[0]) {
      return existingLeaves[0];
    }

    const leaf = this.app.workspace.getLeaf(true);

    await leaf.setViewState({
      type: VIEW_TYPE_PROJECTS,
    });

    return leaf;
  }
}
