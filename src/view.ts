import { ItemView, WorkspaceLeaf } from "obsidian";

import App from "./app/App.svelte";
import { customViews } from "./lib/stores/custom-views";
import { view } from "./lib/stores/obsidian";
import type ProjectsPlugin from "./main";
import type { ProjectViewV2 } from "./custom-view-api";
import { GalleryView } from "./views/Gallery";
import { DeveloperView } from "./views/Developer";
import { CalendarView } from "./views/Calendar";
import { BoardView } from "./views/Board";
import { TableView } from "./views/Table";

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
    const views: Record<string, () => ProjectViewV2> = {};

    for (const pluginId in this.app.plugins.plugins) {
      if (this.app.plugins.enabledPlugins.has(pluginId)) {
        const plugin = this.app.plugins.plugins[pluginId];

        const registerView = plugin?.onRegisterProjectViewV2;

        if (registerView) {
          views[pluginId] = registerView.bind(plugin);
        }
      }
    }

    views["table"] = () => new TableView();
    views["board"] = () => new BoardView();
    views["calendar"] = () => new CalendarView();
    views["gallery"] = () => new GalleryView();
    views["developer"] = () => new DeveloperView();

    return views;
  }
}
