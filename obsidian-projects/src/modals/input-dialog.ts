import { App, Modal } from "obsidian";
import InputDialog from "./components/InputDialog.svelte";

export class InputDialogModal extends Modal {
	// @ts-ignore
	component: InputDialog;

	message: string;
	cta: string;
	onSubmit: (value: string) => void;
	value: string | undefined;

	constructor(
		app: App,
		message: string,
		cta: string,
		onSubmit: (value: string) => void,
		value?: string | undefined
	) {
		super(app);

		this.message = message;
		this.cta = cta;
		this.onSubmit = onSubmit;
		this.value = value;
	}

	onOpen() {
		this.component = new InputDialog({
			target: this.contentEl,
			props: {
				message: this.message,
				cta: this.cta,
				value: this.value ?? "",
				onSubmit: (value: string) => {
					this.onSubmit(value);
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
