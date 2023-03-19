import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { either, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { addIcon, Plugin, TFile, TFolder, WorkspaceLeaf } from "obsidian";
import "obsidian-dataview";
import { createDataRecord, createProject } from "src/lib/data-api";
import { api } from "src/lib/stores/api";
import { i18n } from "src/lib/stores/i18n";
import { app, plugin } from "src/lib/stores/obsidian";
import { settings } from "src/lib/stores/settings";
import { CreateNoteModal } from "src/modals/create-note-modal";
import { CreateProjectModal } from "src/modals/create-project-modal";
import { get, type Unsubscriber } from "svelte/store";
import { registerFileEvents } from "./events";
import { ObsidianFileSystemWatcher } from "./lib/filesystem/obsidian/obsidian";
import { ProjectsSettingTab } from "./settings";
import {
  migrateSettings,
  type ShowCommand,
  type ProjectDefinition,
  type ProjectId,
  type ViewId,
} from "./settings/settings";
import { ProjectsView, VIEW_TYPE_PROJECTS } from "./view";

dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);

export default class ProjectsPlugin extends Plugin {
  unsubscribeSettings?: Unsubscriber;

  async onload() {
    const t = get(i18n).t;

    this.addSettingTab(new ProjectsSettingTab(this.app, this));

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
                    dataSource: {
                      kind: "folder",
                      config: {
                        path: file.path,
                        recursive: false,
                      },
                    },
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
                const record = createDataRecord(name, project);
                await get(api).createNote(record, templatePath);

                const file = this.app.vault.getAbstractFileByPath(record.id);

                if (file instanceof TFile) {
                  this.app.workspace.getLeaf(true).openFile(file);
                }
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

    await this.loadSettings();

    const watcher = new ObsidianFileSystemWatcher(this);

    registerFileEvents(watcher);

    // Save settings to disk whenever settings has been updated.
    this.unsubscribeSettings = settings.subscribe((value) => {
      this.ensureCommands(value.preferences.commands, value.projects);
      this.saveData(value);
    });
  }

  ensureCommands(commands: ShowCommand[], projects: ProjectDefinition[]) {
    const existingCommandIds = new Set<string>(
      this.app.commands
        .listCommands()
        .map(({ id }) => id)
        .filter((id) => id.startsWith("obsidian-projects:show:"))
    );

    // Clean up removed commands.
    existingCommandIds.forEach((id) => {
      const command = commands.find((command) => {
        if (command.view) {
          const existsInPreferences =
            id === `obsidian-projects:show:${command.project}:${command.view}`;

          const existsInProjects = projects.find(
            (project) =>
              project.id === command.project &&
              project.views.find((view) => view.id === command.view)
          );

          return existsInPreferences && existsInProjects;
        } else {
          const existsInPreferences =
            id === `obsidian-projects:show:${command.project}`;

          const existsInProjects = projects.find(
            (project) => project.id === command.project
          );

          return existsInPreferences && existsInProjects;
        }
      });

      if (!command) {
        this.app.commands.removeCommand(id);
      }
    });

    // Add missing commands.
    commands.forEach((command) => {
      if (command.view) {
        const localCommandId = `show:${command.project}:${command.view}`;
        const globalCommandId = `obsidian-projects:show:${command.project}:${command.view}`;

        if (!existingCommandIds.has(globalCommandId)) {
          const project = projects.find(
            (project) => project.id === command.project
          );

          const view = project?.views.find((view) => view.id === command.view);

          if (project && view) {
            this.addCommand({
              id: localCommandId,
              name: `Show ${project.name} > ${view.name}`,
              callback: () => {
                this.activateView(project.id, view.id);
              },
            });
          }
        }
      } else {
        const localCommandId = `show:${command.project}`;
        const globalCommandId = `obsidian-projects:show:${command.project}`;

        if (!existingCommandIds.has(globalCommandId)) {
          const project = projects.find(
            (project) => project.id === command.project
          );

          if (project) {
            this.addCommand({
              id: localCommandId,
              name: `Show ${project.name}`,
              callback: () => {
                this.activateView(project.id);
              },
            });
          }
        }
      }
    });
  }

  async loadSettings() {
    return pipe(
      taskEither.tryCatch(() => this.loadData(), either.toError),
      taskEither.map(migrateSettings),
      taskEither.chain(taskEither.fromEither),
      task.map(
        either.fold(
          (err) => {
            throw err;
          },
          (value) => {
            settings.set(value);
          }
        )
      )
    )();
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_PROJECTS);

    this.unsubscribeSettings?.();
  }

  // activateView opens the main Projects view in a new workspace leaf.
  async activateView(projectId?: ProjectId, viewId?: ViewId) {
    const leaf = await this.getOrCreateLeaf();

    leaf.setViewState({
      type: VIEW_TYPE_PROJECTS,
      state: {
        projectId,
        viewId,
      },
    });

    this.app.workspace.revealLeaf(leaf);
  }

  async getOrCreateLeaf(): Promise<WorkspaceLeaf> {
    const existingLeaves =
      this.app.workspace.getLeavesOfType(VIEW_TYPE_PROJECTS);

    if (existingLeaves[0]) {
      return existingLeaves[0];
    }

    return this.app.workspace.getLeaf(true);
  }
}
