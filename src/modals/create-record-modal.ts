import { App, Modal } from "obsidian";
import type { WorkspaceDefinition } from "src/main";
import CreateRecord from "../components/modals/CreateRecord.svelte";

export class CreateRecordModal extends Modal {
	// @ts-ignore
	component: CreateRecord;

	workspace: WorkspaceDefinition;

	onSave: (
		name: string,
		templatePath: string,
		workspace: WorkspaceDefinition
	) => void;

	constructor(
		app: App,
		workspace: WorkspaceDefinition,
		onSave: (
			name: string,
			templatePath: string,
			workspace: WorkspaceDefinition
		) => void
	) {
		super(app);

		this.onSave = onSave;
		this.workspace = workspace;
	}

	onOpen() {
		this.component = new CreateRecord({
			target: this.contentEl,
			props: {
				name: "",
				workspace: this.workspace,
				onSave: (
					name: string,
					templatePath: string,
					workspace: WorkspaceDefinition
				) => {
					this.onSave(name, templatePath, workspace);
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
