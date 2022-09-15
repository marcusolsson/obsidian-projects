import { ItemView, WorkspaceLeaf } from "obsidian";

import App from "./components/App.svelte";
import { app, plugin, view } from "./lib/stores/obsidian";
import type ProjectsPlugin from "./main";

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
		app.set(this.app);
		plugin.set(this.plugin);
		view.set(this);
	}

	onunload(): void {}

	async onOpen() {
		this.component = new App({
			target: this.contentEl,
		});
	}

	async onClose() {
		if (this.component) {
			this.component.$destroy();
		}
	}
}
