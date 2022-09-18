import { App, Modal } from "obsidian";
import type { WorkspaceDefinition } from "src/main";
import CreateRecord from "../components/modals/CreateRecord.svelte";

export class CreateRecordModal extends Modal {
	// @ts-ignore
	component: CreateRecord;

	workspace: WorkspaceDefinition;

	onSave: (name: string, templatePath: string) => void;

	constructor(
		app: App,
		workspace: WorkspaceDefinition,
		onSave: (name: string, templatePath: string) => void
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
				noteTemplate: this.workspace.noteTemplate,
				templateFolder: this.workspace.templateFolder,
				onSave: (name: string, templatePath: string) => {
					this.onSave(name, templatePath);
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
