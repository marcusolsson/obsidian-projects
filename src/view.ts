import {
  Plugin,
  ItemView,
  WorkspaceLeaf,
  Menu,
  type ViewStateResult,
} from "obsidian";
import { get } from "svelte/store";

import App from "src/ui/app/App.svelte";
import { i18n } from "./lib/stores/i18n";
import { customViews } from "src/lib/stores/customViews";
import { view } from "src/lib/stores/obsidian";
import { BoardView } from "src/ui/views/Board";
import { CalendarView } from "src/ui/views/Calendar";
// import { DeveloperView } from "src/views/Developer";
import { GalleryView } from "src/ui/views/Gallery";
import { TableView } from "src/ui/views/Table";

import type { ProjectView } from "./customViewApi";
import type ProjectsPlugin from "./main";
import type { ProjectId, ViewId } from "./settings/settings";

export const VIEW_TYPE_PROJECTS = "obsidian-projects";

export type ProjectsViewState = {
  projectId: ProjectId;
  viewId: ViewId;
};

/**
 * ProjectsView is the main projects view. The view is primarily a Svelte
 * application, so this class mainly instantiates and mounts the Svelte app.
 */
export class ProjectsView extends ItemView {
  component?: App;

  constructor(leaf: WorkspaceLeaf, readonly plugin: ProjectsPlugin) {
    super(leaf);

    // Whether this view can be used to navigate to other Obsidian views.
    this.navigation = true;
  }

  getViewType() {
    return VIEW_TYPE_PROJECTS;
  }

  getDisplayText() {
    return "Projects";
  }

  getIcon() {
    return "projects-icon";
  }

  onPaneMenu(menu: Menu, source: "more-options" | "tab-header" | string) {
    if (source == "more-options" || source == "tab-header") {
      super.onPaneMenu(menu, source);
      menu.addItem((item) => {
        item
          .setTitle(get(i18n).t("menus.tab-header.new-window.title"))
          .setIcon("picture-in-picture-2")
          .onClick(() => {
            const existingLeaves =
              this.app.workspace.getLeavesOfType(VIEW_TYPE_PROJECTS);
            if (existingLeaves[0]) {
              this.app.workspace.moveLeafToPopout(existingLeaves[0]);
            }
          })
          .setSection("open");
      });
      return;
    }

    // In other cases, keep the original behavior
    super.onPaneMenu(menu, source);
  }

  async onload() {
    view.set(this);
  }

  async setState(
    state: ProjectsViewState,
    result: ViewStateResult
  ): Promise<void> {
    if (this.component) {
      this.component.$set({
        projectId: state.projectId,
        viewId: state.viewId,
      });
    }

    super.setState(state, result);
  }

  async onOpen() {
    customViews.set(this.getProjectViews());

    this.component = new App({
      target: this.contentEl,
    });
  }

  async onClose() {
    if (this.component) {
      this.component.$destroy();
    }
  }

  /**
   * getProjectViews returns a map of instances for each supported Projects view.
   */
  getProjectViews() {
    const views: Record<string, ProjectView> = {};

    // Allow other Obsidian plugins to register custom views.
    this.getEnabledPlugins().forEach((plugin) => {
      // Other Obsidian plugins can add an onRegisterProjectView to register a
      // Projects view.
      const registerView = plugin.onRegisterProjectView;

      if (registerView) {
        const create = registerView.bind(plugin);
        const instance = create();

        views[instance.getViewType()] = instance;
      }
    });

    // Register built-in views.
    views["table"] = new TableView();
    views["board"] = new BoardView();
    views["calendar"] = new CalendarView();
    views["gallery"] = new GalleryView();
    // views["developer"] = new DeveloperView();

    return views;
  }

  /**
   * getEnabledPlugins returns a list of the enabled Obsidian plugins.
   */
  getEnabledPlugins(): Plugin[] {
    const res: Plugin[] = [];

    for (const pluginId in this.app.plugins.plugins) {
      const plugin = this.app.plugins.getPlugin(pluginId);

      if (plugin) {
        res.push(plugin);
      }
    }

    return res;
  }
}
