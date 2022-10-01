import { App, Modal } from "obsidian";
import AddView from "../components/modals/AddView.svelte";
import type { ViewDefinition, WorkspaceDefinition } from "../types";

export class AddViewModal extends Modal {
	// @ts-expect-error
	component: AddView;

	workspace: WorkspaceDefinition;
	onSave: (workspaceId: string, view: ViewDefinition) => void;

	constructor(
		app: App,
		workspace: WorkspaceDefinition,
		onSave: (workspaceId: string, view: ViewDefinition) => void
	) {
		super(app);

		this.workspace = workspace;
		this.onSave = onSave;
	}

	onOpen() {
		this.component = new AddView({
			target: this.contentEl,
			props: {
				workspace: this.workspace,
				onSave: (workspaceId: string, view: ViewDefinition) => {
					this.onSave(workspaceId, view);
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
