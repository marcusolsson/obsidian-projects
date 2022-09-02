import { addIcon, Plugin } from "obsidian";
import { ProjectsView, VIEW_TYPE_PROJECTS } from "./view";

import isoWeek from "dayjs/plugin/isoWeek";
import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import { registerFileEvents } from "./lib/stores/file-index";

dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);

export interface ViewDefinition {
	name: string;
	id: string;
	type: string;
	config: Record<string, any>;
}

export interface WorkspaceDefinition {
	name: string;
	id: string;
	path: string;
	recursive: boolean;
	views: ViewDefinition[];
}

export interface ProjectsPluginSettings {
	lastWorkspaceId?: string | undefined;
	lastViewId?: string | undefined;
	workspaces: WorkspaceDefinition[];
}

export const DEFAULT_SETTINGS: Partial<ProjectsPluginSettings> = {
	workspaces: [],
};

export default class ProjectsPlugin extends Plugin {
	async onload() {
		this.registerView(
			VIEW_TYPE_PROJECTS,
			(leaf) => new ProjectsView(leaf, this)
		);

		this.addCommand({
			id: "show-projects",
			name: "Show projects",
			callback: async () => {
				this.activateView();
			},
		});

		this.addIcons();

		registerFileEvents(this);
	}

	async onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_PROJECTS);
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_PROJECTS);

		await this.app.workspace.getLeaf(true).setViewState({
			type: VIEW_TYPE_PROJECTS,
			active: true,
		});

		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_PROJECTS);

		if (leaves[0]) {
			this.app.workspace.revealLeaf(leaves[0]);
		}
	}

	addIcons() {
		addIcon(
			"text",
			`<g transform="matrix(1,0,0,1,2,2)"><path d="M20,32L28,32L28,24L41.008,24L30.72,72L20,72L20,80L52,80L52,72L42.992,72L53.28,24L68,24L68,32L76,32L76,16L20,16L20,32Z" /></g>`
		);
	}
}
