import { App, Modal } from "obsidian";
import AddView from "../components/modals/AddView.svelte";
import type { ViewDefinition } from "../main";

export class AddViewModal extends Modal {
	component: AddView;
	onSave: (view: ViewDefinition) => void;

	constructor(app: App, onSave: (view: ViewDefinition) => void) {
		super(app);

		this.onSave = onSave;
	}

	onOpen() {
		this.component = new AddView({
			target: this.contentEl,
			props: {
				onSave: (view: ViewDefinition) => {
					this.onSave(view);
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
