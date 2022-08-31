import { addIcon, Plugin } from "obsidian";
import { registerFileEvents } from "./lib/stores/files";
import { ProjectsView, VIEW_TYPE_PROJECTS } from "./view";

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
	lastWorkspaceId?: string;
	lastViewId?: string;
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
			"number",
			`<g transform="matrix(1,0,0,1,2,2)"><path d="M64.072,15.26L60.928,32L41.064,32L43.928,16.74L36.072,15.26L32.928,32L16,32L16,40L31.428,40L28.424,56L12,56L12,64L26.924,64L24.068,79.22L31.928,80.696L35.064,64L54.928,64L52.072,79.22L59.932,80.696L63.064,64L80,64L80,56L64.564,56L67.568,40L84,40L84,32L69.068,32L71.932,16.74L64.072,15.26ZM56.424,56L36.564,56L39.568,40L59.432,40L56.424,56Z" /></g>`
		);
		addIcon(
			"text",
			`<g transform="matrix(1,0,0,1,2,2)"><path d="M20,32L28,32L28,24L41.008,24L30.72,72L20,72L20,80L52,80L52,72L42.992,72L53.28,24L68,24L68,32L76,32L76,16L20,16L20,32Z" /></g>`
		);
		addIcon(
			"date",
			`<g transform="matrix(1,0,0,1,2,2)"><path d="M84,80L84,24C84,19.588 80.412,16 76,16L68,16L68,8L60,8L60,16L36,16L36,8L28,8L28,16L20,16C15.588,16 12,19.588 12,24L12,80C12,84.412 15.588,88 20,88L76,88C80.412,88 84,84.412 84,80ZM36,72L28,72L28,64L36,64L36,72ZM36,56L28,56L28,48L36,48L36,56ZM52,72L44,72L44,64L52,64L52,72ZM52,56L44,56L44,48L52,48L52,56ZM68,72L60,72L60,64L68,64L68,72ZM68,56L60,56L60,48L68,48L68,56ZM76,36L20,36L20,28L76,28L76,36Z" /></g>`
		);
		addIcon(
			"boolean",
			`<g transform="matrix(1,0,0,1,2,2)"><path d="M28,20C23.611,20 20,23.611 20,28L20,68C20,72.389 23.611,76 28,76L68,76C72.389,76 76,72.389 76,68L76,28C76,23.611 72.389,20 68,20L28,20ZM44,61.656L33.172,50.828L38.828,45.172L44,50.344L59.172,35.172L64.828,40.828L44,61.656Z" /></g>`
		);
	}
}
