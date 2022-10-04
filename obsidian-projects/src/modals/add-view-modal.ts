import { App, Modal } from "obsidian";
import AddView from "../components/modals/AddView.svelte";
import type { ViewDefinition, ProjectDefinition } from "../types";

export class AddViewModal extends Modal {
	// @ts-expect-error
	component: AddView;

	project: ProjectDefinition;
	onSave: (projectId: string, view: ViewDefinition) => void;

	constructor(
		app: App,
		project: ProjectDefinition,
		onSave: (projectId: string, view: ViewDefinition) => void
	) {
		super(app);

		this.project = project;
		this.onSave = onSave;
	}

	onOpen() {
		this.component = new AddView({
			target: this.contentEl,
			props: {
				project: this.project,
				onSave: (projectId: string, view: ViewDefinition) => {
					this.onSave(projectId, view);
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
