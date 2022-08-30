import { App, Modal } from "obsidian";
import ConfirmDialog from "../components/modals/ConfirmDialog.svelte";

export class ConfirmDialogModal extends Modal {
	component: ConfirmDialog;

	onConfirm: () => void;

	constructor(app: App, onConfirm: () => void) {
		super(app);

		this.onConfirm = onConfirm;
	}

	onOpen() {
		this.component = new ConfirmDialog({
			target: this.contentEl,
			props: {
				onConfirm: () => {
					this.onConfirm();
					this.close();
				},
				onCancel: () => {
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
