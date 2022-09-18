import { App, Modal } from "obsidian";
import CreateWorkspace from "../components/modals/CreateWorkspace.svelte";
import type { WorkspaceDefinition } from "../main";

export class CreateWorkspaceModal extends Modal {
	// @ts-ignore
	component: CreateWorkspace;

	title: string;
	cta: string;
	onSave: (workspace: WorkspaceDefinition) => void;
	defaults: Partial<WorkspaceDefinition> | undefined;

	constructor(
		app: App,
		title: string,
		cta: string,
		onSave: (workspace: WorkspaceDefinition) => void,
		defaults?: Partial<WorkspaceDefinition>
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
				name: this.defaults?.name ?? "Untitled workspace",
				path: this.defaults?.path ?? "",
				templateFolder: this.defaults?.templateFolder ?? "",
				noteTemplate: this.defaults?.noteTemplate ?? "",
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
