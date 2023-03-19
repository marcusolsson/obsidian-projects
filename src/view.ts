import {
  Plugin,
  ItemView,
  WorkspaceLeaf,
  type ViewStateResult,
} from "obsidian";

import App from "src/app/App.svelte";
import { customViews } from "src/lib/stores/custom-views";
import { view } from "src/lib/stores/obsidian";
import { BoardView } from "src/views/Board";
import { CalendarView } from "src/views/Calendar";
// import { DeveloperView } from "src/views/Developer";
import { GalleryView } from "src/views/Gallery";
import { TableView } from "src/views/Table";

import type { ProjectView } from "./custom-view-api";
import type ProjectsPlugin from "./main";
import type { ProjectId, ViewId } from "./settings/settings";

export const VIEW_TYPE_PROJECTS = "obsidian-projects";

export type ProjectsViewState = {
  projectId: ProjectId;
  viewId: ViewId;
};

export class ProjectsView extends ItemView {
  component?: App;

  constructor(leaf: WorkspaceLeaf, readonly plugin: ProjectsPlugin) {
    super(leaf);

    this.navigation = true;
  }

  getViewType() {
    return VIEW_TYPE_PROJECTS;
  }

  getDisplayText() {
    return "Projects";
  }

  getIcon() {
    return "layout";
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
    const views = this.getViews();

    customViews.set(views);

    this.component = new App({
      target: this.contentEl,
    });
  }

  async onClose() {
    if (this.component) {
      this.component.$destroy();
    }
  }

  getViews() {
    const views: Record<string, ProjectView> = {};

    this.getEnabledPlugins().forEach((plugin) => {
      const registerView = plugin.onRegisterProjectView;

      if (registerView) {
        const create = registerView.bind(plugin);
        const instance = create();

        views[instance.getViewType()] = instance;
      }
    });

    views["table"] = new TableView();
    views["board"] = new BoardView();
    views["calendar"] = new CalendarView();
    views["gallery"] = new GalleryView();
    // views["developer"] = new DeveloperView();

    return views;
  }

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
