import { App, Modal } from "obsidian";
import ConfirmDialog from "../components/modals/ConfirmDialog.svelte";

export class ConfirmDialogModal extends Modal {
	// @ts-ignore
	component: ConfirmDialog;

	title: string;
	message: string;
	cta: string;
	onConfirm: () => void;

	constructor(
		app: App,
		title: string,
		message: string,
		cta: string,
		onConfirm: () => void
	) {
		super(app);

		this.title = title;
		this.message = message;
		this.cta = cta;
		this.onConfirm = onConfirm;
	}

	onOpen() {
		this.component = new ConfirmDialog({
			target: this.contentEl,
			props: {
				title: this.title,
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
