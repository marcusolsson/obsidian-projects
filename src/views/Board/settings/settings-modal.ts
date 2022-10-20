import { App, Modal } from "obsidian";
import type { BoardConfig } from "../types";
import BoardSettings from "./BoardSettings.svelte";

export class BoardSettingsModal extends Modal {
	// @ts-ignore
	component: BoardSettings;

	constructor(
		app: App,
		readonly config: BoardConfig,
		readonly onSave: (config: BoardConfig) => void
	) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;

		this.component = new BoardSettings({
			target: contentEl,
			props: {
				config: this.config,
				onSave: (config: BoardConfig) => {
					this.onSave(config);
				},
			},
		});
	}

	onClose(): void {
		if (this.component) {
			this.component.$destroy();
		}
	}
}
