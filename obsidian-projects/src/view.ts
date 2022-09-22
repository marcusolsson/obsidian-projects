import { ItemView, WorkspaceLeaf } from "obsidian";

import App from "./components/App.svelte";
import { customViews } from "./lib/stores/custom-views";
import { view } from "./lib/stores/obsidian";
import type ProjectsPlugin from "./main";
import type { ProjectView } from "./builder";

export const VIEW_TYPE_PROJECTS = "obsidian-projects";

export class ProjectsView extends ItemView {
	plugin: ProjectsPlugin;

	// @ts-ignore
	component: App;

	constructor(leaf: WorkspaceLeaf, plugin: ProjectsPlugin) {
		super(leaf);

		this.plugin = plugin;
		this.navigation = true;
	}

	getViewType() {
		return VIEW_TYPE_PROJECTS;
	}

	getDisplayText() {
		return "Projects";
	}

	async onload() {
		view.set(this);
	}

	onunload(): void {}

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
