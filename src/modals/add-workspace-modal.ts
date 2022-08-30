import { App, Modal } from "obsidian";
import AddWorkspace from "../components/modals/AddWorkspace.svelte";
import type { WorkspaceDefinition } from "../main";

export class AddWorkspaceModal extends Modal {
	component: AddWorkspace;
	onSave: (workspace: WorkspaceDefinition) => void;

	constructor(app: App, onSave: (workspace: WorkspaceDefinition) => void) {
		super(app);

		this.onSave = onSave;
	}

	onOpen() {
		this.component = new AddWorkspace({
			target: this.contentEl,
			props: {
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
