import { ItemView, WorkspaceLeaf } from "obsidian";

import App from "./app/App.svelte";
import { customViews, customViewsV2 } from "./lib/stores/custom-views";
import { view } from "./lib/stores/obsidian";
import type ProjectsPlugin from "./main";
import type { ProjectView, ProjectViewV2 } from "./builder";

export const VIEW_TYPE_PROJECTS = "obsidian-projects";

export class ProjectsView extends ItemView {
  // @ts-ignore
  component: App;

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

  onunload(): void {}

  async onOpen() {
    customViews.set(this.getViews());
    customViewsV2.set(this.getViewsV2());

    this.component = new App({
      target: this.contentEl,
    });
  }

  async onClose() {
    if (this.component) {
      this.component.$destroy();
    }
  }

  getViewsV2() {
    const views: Record<string, () => ProjectViewV2> = {};

    for (let pluginId in this.app.plugins.plugins) {
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

  getViews() {
    const views: Record<string, (view: ProjectView) => void> = {};

    for (let pluginId in this.app.plugins.plugins) {
      if (this.app.plugins.enabledPlugins.has(pluginId)) {
        const plugin = this.app.plugins.plugins[pluginId];

        const registerView = plugin?.onRegisterProjectView;

        if (registerView) {
          views[pluginId] = registerView.bind(plugin);
        }
      }
    }

    return views;
  }
}
