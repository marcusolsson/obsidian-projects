import { App, Modal } from "obsidian";
import ConfirmDialog from "../components/modals/ConfirmDialog.svelte";

export class ConfirmDialogModal extends Modal {
	// @ts-ignore
	component: ConfirmDialog;

	message: string;
	cta: string;
	onConfirm: () => void;

	constructor(app: App, message: string, cta: string, onConfirm: () => void) {
		super(app);

		this.message = message;
		this.cta = cta;
		this.onConfirm = onConfirm;
	}

	onOpen() {
		this.component = new ConfirmDialog({
			target: this.contentEl,
			props: {
				message: this.message,
				cta: this.cta,
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
