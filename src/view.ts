import { ItemView, WorkspaceLeaf } from "obsidian";

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

export const VIEW_TYPE_PROJECTS = "obsidian-projects";

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

    for (const pluginId in this.app.plugins.plugins) {
      if (this.app.plugins.enabledPlugins.has(pluginId)) {
        const plugin = this.app.plugins.plugins[pluginId];

        const registerView = plugin?.onRegisterProjectView;

        if (registerView) {
          const create = registerView.bind(plugin);
          const instance = create();

          views[instance.getViewType()] = instance;
        }
      }
    }

    views["table"] = new TableView();
    views["board"] = new BoardView();
    views["calendar"] = new CalendarView();
    views["gallery"] = new GalleryView();
    // views["developer"] = new DeveloperView();

    return views;
  }
}
