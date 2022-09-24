import { App, Modal } from "obsidian";
import CreateWorkspace from "../components/modals/CreateWorkspace.svelte";
import type { WorkspaceDefinition } from "../types";

export class CreateWorkspaceModal extends Modal {
	// @ts-ignore
	component: CreateWorkspace;

	title: string;
	cta: string;
	onSave: (workspace: WorkspaceDefinition) => void;
	defaults: WorkspaceDefinition;

	constructor(
		app: App,
		title: string,
		cta: string,
		onSave: (workspace: WorkspaceDefinition) => void,
		defaults: WorkspaceDefinition
	) {
		super(app);

		this.title = title;
		this.cta = cta;
		this.onSave = onSave;
		this.defaults = defaults;
	}

	onOpen() {
		this.component = new CreateWorkspace({
			target: this.contentEl,
			props: {
				title: this.title,
				cta: this.cta,
				workspace: this.defaults,
				onSave: (workspace: WorkspaceDefinition) => {
					this.onSave(workspace);
					this.close();
				},
			},
		});
	}

	onClose() {
		if (this.component) {
			this.component.$destroy();
		}
	}
}
