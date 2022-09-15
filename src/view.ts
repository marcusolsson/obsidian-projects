import { ItemView, WorkspaceLeaf } from "obsidian";
import type { Unsubscriber } from "svelte/store";

import App from "./components/App.svelte";
import { app, plugin, view } from "./lib/stores/obsidian";
import { settings } from "./lib/stores/settings";
import type ProjectsPlugin from "./main";
import { DEFAULT_SETTINGS } from "./main";

export const VIEW_TYPE_PROJECTS = "obsidian-projects";

export class ProjectsView extends ItemView {
	plugin: ProjectsPlugin;

	// @ts-ignore
	component: App;

	// @ts-ignore
	unsubscribeSettings: Unsubscriber;

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

		settings.set(
			Object.assign({}, DEFAULT_SETTINGS, await this.plugin.loadData())
		);

		this.unsubscribeSettings = settings.subscribe((value) => {
			this.plugin.saveData(value);
		});
	}

	onunload(): void {
		this.unsubscribeSettings();
	}

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
