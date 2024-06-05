import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { either, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { Plugin, TFile, TFolder, WorkspaceLeaf, addIcon } from "obsidian";
import "obsidian-dataview";
import { createDataRecord, createProject } from "src/lib/dataApi";
import { api } from "src/lib/stores/api";
import { i18n } from "src/lib/stores/i18n";
import { app, plugin } from "src/lib/stores/obsidian";
import { settings } from "src/lib/stores/settings";
import { CreateNoteModal } from "src/ui/modals/createNoteModal";
import { CreateProjectModal } from "src/ui/modals/createProjectModal";
import { get, type Unsubscriber } from "svelte/store";
import { registerFileEvents } from "./events";
import { ObsidianFileSystemWatcher } from "./lib/filesystem/obsidian/filesystem";
import { ProjectsSettingTab } from "./ui/settings/settings";
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
    await this.loadSettings();

    // Helper function for translation.
    const { t } = get(i18n);

    this.addSettingTab(new ProjectsSettingTab(this.app, this));

    addIcon(
      "projects-icon",
      `
      <g>
        <path d="m84.42478,20.01081l10.10281,0l0,74.55223l-74.55082,0l0,-10.17944l10.14538,0l0,0.03689l54.26005,0l0,-0.03689l0.04257,0l0,-64.37279zm-18.92858,10.14255l-35.37403,0l0,35.29883l-10.10281,0l0,-45.44137l45.47685,0l0,10.14255l0,-0.00001z" fill="currentColor"/>
          <g transform="matrix(0.676126 0 0 0.676126 -406.678 -7.59132)">
            <path d="m719.83653,129.53201l-110.26,0l0,-110.263l110.26,0l0,110.263zm-15,-95.263l-80.26,0l0,80.263l80.26,0l0,-80.263z" fill="currentColor"/>
          </g>
      </g>
      `
    );

    this.addRibbonIcon("projects-icon", "Open projects", () => {
      this.activateView();
    });

    this.registerView(
      VIEW_TYPE_PROJECTS,
      (leaf) => new ProjectsView(leaf, this)
    );

    this.registerHoverLinkSource(VIEW_TYPE_PROJECTS, {
      display: "Projects Task Notes",
      defaultMod: false
    });

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

    // Command to show the Projects view.
    this.addCommand({
      id: "show-projects",
      name: t("commands.show-projects.name"),
      callback: () => {
        this.activateView();
      },
    });

    // Command to create a new project.
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

    // Command to create a new note.
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

                // Open the created note in a new tab.
                const file = this.app.vault.getAbstractFileByPath(record.id);
                if (file instanceof TFile) {
                  this.app.workspace.getLeaf("tab").openFile(file);
                }
              }
            ).open();
          }

          return true;
        }

        return false;
      },
    });

    // Initialize Svelte stores so that Svelte components can access the App and
    // Plugin objects.
    app.set(this.app);
    plugin.set(this);

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
      active: true,
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

    return this.app.workspace.getLeaf("tab");
  }

  /**
   * ensureCommands syncs enabled and registered show commands for individual
   * views and projects
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

/**
 * getShowCommandId returns the command identifier for a Show command.
 *
 * A command id for Show commands has the following structure:
 *
 * show:<project-id>
 * show:<project-id>:<view-id>
 *
 * If `global` is true, the plugin id is prepended to the command id.
 *
 * obsidian-projects:show:<project-id>
 * obsidian-projects:show:<project-id>:<view-id>
 */
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
