import { ItemView, WorkspaceLeaf } from "obsidian";

import App from "./app/App.svelte";
import { customViews } from "./lib/stores/custom-views";
import { view } from "./lib/stores/obsidian";
import type ProjectsPlugin from "./main";
import type { ProjectViewV2 } from "./custom-view-api";
import { GalleryView } from "./views/Gallery/gallery-view";

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
    customViews.set(this.getViews());

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

    views["obsidian-projects"] = () => new GalleryView();

    for (const pluginId in this.app.plugins.plugins) {
      if (this.app.plugins.enabledPlugins.has(pluginId)) {
        const plugin = this.app.plugins.plugins[pluginId];

        const registerView = plugin?.onRegisterProjectViewV2;

        if (registerView) {
          views[pluginId] = registerView.bind(plugin);
        }
      }
    }

    return views;
  }
}
