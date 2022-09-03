import { ItemView, WorkspaceLeaf } from "obsidian";

import App from "./components/App.svelte";
import { customViews } from "./lib/stores/custom-views";
import { view } from "./lib/stores/obsidian";
import type ProjectsPlugin from "./main";
import type { Builder } from "./builder";

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
		const views: Record<string, () => Builder> = {};

		for (let plugin in this.app.plugins.plugins) {
			const creator =
				this.app.plugins.plugins[plugin]?.onRegisterProjectView;

			if (creator) {
				views[plugin] = creator;
			}
		}

		return views;
	}
}
