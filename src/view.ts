import { ItemView, WorkspaceLeaf } from "obsidian";

import App from "./app/App.svelte";
import { customViews } from "./lib/stores/custom-views";
import { view } from "./lib/stores/obsidian";
import type ProjectsPlugin from "./main";
import type { ProjectView } from "./custom-view-api";
import { GalleryView } from "./views/Gallery";
import { TimelineView } from "./views/Timeline/timeline-view";
import { DeveloperView } from "./views/Developer";
import { CalendarView } from "./views/Calendar";
import { BoardView } from "./views/Board";
import { TableView } from "./views/Table";
// import { DeveloperView } from "./views/Developer/developer-view";

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
    views["developer"] = new DeveloperView();
		views["timeline"] = new TimelineView();

    return views;
  }
}
