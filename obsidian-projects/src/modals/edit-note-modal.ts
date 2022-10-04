import { App, Modal } from "obsidian";
import type { DataField, DataRecord } from "../lib/types";
import EditRecord from "../components/modals/EditNote.svelte";

export class EditNoteModal extends Modal {
	fields: DataField[];
	onSave: (record: DataRecord) => void;
	defaults?: DataRecord | undefined;

	// @ts-ignore
	component: EditRecord;

	constructor(
		app: App,
		fields: DataField[],
		onSave: (record: DataRecord) => void,
		defaults?: DataRecord
	) {
		super(app);

		this.defaults = defaults;
		this.fields = fields;
		this.onSave = onSave;
	}

	onOpen() {
		this.component = new EditRecord({
			target: this.contentEl,
			props: {
				record: this.defaults,
				fields: this.fields,
				onSave: (record: DataRecord) => {
					this.onSave(record);
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
