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
  type ProjectDefinition,
  type ProjectId,
  type ShowCommand,
  type ViewId,
} from "./settings/settings";
import { ProjectsView, VIEW_TYPE_PROJECTS } from "./view";

dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);

const PROJECTS_PLUGIN_ID = "obsidian-projects";

export default class ProjectsPlugin extends Plugin {
  unsubscribeSettings?: Unsubscriber;

  /**
   * onload runs when the plugin is enabled.
   */
  async onload(): Promise<void> {
    const t = get(i18n).t;

    this.addSettingTab(new ProjectsSettingTab(this.app, this));

    this.registerView(
      VIEW_TYPE_PROJECTS,
      (leaf) => new ProjectsView(leaf, this)
    );

    // Allow the user to create a project by right-clicking a folder in the
    // File explorer.
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
      // checkCallback because we don't want to create notes if there are no
      // projects.
      checkCallback: (checking) => {
        const project = get(settings).projects[0];

        if (project) {
          if (!checking) {
            new CreateNoteModal(
              this.app,
              project,
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

    // Add an icon for text fields. Remove once Obsidian has a decent
    // alternative.
    addIcon(
      "text",
      `<g transform="matrix(1,0,0,1,2,2)"><path d="M20,32L28,32L28,24L41.008,24L30.72,72L20,72L20,80L52,80L52,72L42.992,72L53.28,24L68,24L68,32L76,32L76,16L20,16L20,32Z" /></g>`
    );

    // Initialize Svelte stores so that Svelte components can access the App and
    // Plugin objects.
    app.set(this.app);
    plugin.set(this);

    await this.loadSettings();

    // Save settings to disk whenever settings has been updated.
    this.unsubscribeSettings = settings.subscribe((value) => {
      this.ensureCommands(value.preferences.commands, value.projects);
      this.saveData(value);
    });

    const watcher = new ObsidianFileSystemWatcher(this);
    registerFileEvents(watcher);
  }

  /**
   * onunload runs when the plugin is disabled. Use it to clean up any resources
   * you've allocated in the onload method.
   */
  async onunload(): Promise<void> {
    if (this.unsubscribeSettings) {
      this.unsubscribeSettings();
    }
  }

  /**
   * loadSettings loads settings from disk, migrates it to the latest version,
   * and updates the Svelte store for settings.
   */
  async loadSettings(): Promise<void> {
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

  /**
   * activateView opens the main Projects view in a new workspace leaf.
   * */
  async activateView(projectId?: ProjectId, viewId?: ViewId): Promise<void> {
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

  /**
   * getOrCreateLeaf returns a new leaf, or returns an existing leaf if
   * Projects is already open.
   */
  async getOrCreateLeaf(): Promise<WorkspaceLeaf> {
    const existingLeaves =
      this.app.workspace.getLeavesOfType(VIEW_TYPE_PROJECTS);

    if (existingLeaves[0]) {
      return existingLeaves[0];
    }

    return this.app.workspace.getLeaf(true);
  }

  /**
   * ensureCommands syncs enabled and registered show commands.
   */
  ensureCommands(
    enabledCommands: ShowCommand[],
    projects: ProjectDefinition[]
  ): void {
    const registeredCommandIds = new Set<string>(
      Object.keys(this.app.commands.commands).filter((id) =>
        id.startsWith(`${PROJECTS_PLUGIN_ID}:show:`)
      )
    );

    this.removeMissingCommands(enabledCommands, projects, registeredCommandIds);
    this.addMissingCommands(enabledCommands, projects, registeredCommandIds);
  }

  /**
   * removeMissingCommands cleans up registered show commands that have either
   * been disabled from the settings, or where the project or view has been
   * deleted.
   */
  removeMissingCommands(
    enabledCommands: ShowCommand[],
    projects: ProjectDefinition[],
    registeredCommandIds: Set<string>
  ): void {
    registeredCommandIds.forEach((id) => {
      const enabledCommand = enabledCommands.find(
        (command) => id === getShowCommandId(command, true)
      );

      // Unregister command if it's been disabled.
      if (!enabledCommand) {
        this.app.commands.removeCommand(id);
        return;
      }

      const project = projects.find((project) => {
        if (enabledCommand.view) {
          return (
            project.id === enabledCommand.project &&
            project.views.find((view) => view.id === enabledCommand.view)
          );
        } else {
          return project.id === enabledCommand.project;
        }
      });

      // Unregister command if it's been deleted.
      if (!project) {
        this.app.commands.removeCommand(id);
      }
    });
  }

  /**
   * addMissingCommands registers show commands that have been enabled but not
   * registered.
   */
  addMissingCommands(
    enabledCommands: ShowCommand[],
    projects: ProjectDefinition[],
    registeredCommandIds: Set<string>
  ): void {
    enabledCommands.forEach((command) => {
      const globalId = getShowCommandId(command, true);
      const localId = getShowCommandId(command, false);

      if (registeredCommandIds.has(globalId)) {
        // Command has been both enabled and registered. All is well.
        return;
      }

      const project = projects.find(
        (project) => project.id === command.project
      );

      if (project) {
        if (command.view) {
          const view = project?.views.find((view) => view.id === command.view);

          if (view) {
            this.addCommand({
              id: localId,
              name: `Show ${project.name} > ${view.name}`,
              callback: () => {
                this.activateView(project.id, view.id);
              },
            });
          }
        } else {
          this.addCommand({
            id: localId,
            name: `Show ${project.name}`,
            callback: () => {
              this.activateView(project.id);
            },
          });
        }
      }
    });
  }
}

function getShowCommandId(cmd: ShowCommand, global: boolean): string {
  const res = [];

  if (global) {
    res.push(PROJECTS_PLUGIN_ID);
  }

  res.push("show");

  if (cmd.project) {
    res.push(cmd.project);
  }
  if (cmd.view) {
    res.push(cmd.view);
  }

  return res.join(":");
}
