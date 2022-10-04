import { App, Modal } from "obsidian";
import CreateProject from "../components/modals/CreateProject.svelte";
import type { ProjectDefinition } from "../types";

export class CreateProjectModal extends Modal {
	// @ts-ignore
	component: CreateProject;

	title: string;
	cta: string;
	onSave: (project: ProjectDefinition) => void;
	defaults: ProjectDefinition;

	constructor(
		app: App,
		title: string,
		cta: string,
		onSave: (project: ProjectDefinition) => void,
		defaults: ProjectDefinition
	) {
		super(app);

		this.title = title;
		this.cta = cta;
		this.onSave = onSave;
		this.defaults = defaults;
	}

	onOpen() {
		this.component = new CreateProject({
			target: this.contentEl,
			props: {
				title: this.title,
				cta: this.cta,
				project: this.defaults,
				onSave: (project: ProjectDefinition) => {
					this.onSave(project);
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
