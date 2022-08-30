import { App, Modal } from "obsidian";
import type { DataField, DataRecord } from "../lib/datasource";
import EditRecord from "../components/modals/EditRecord.svelte";

export class ConfigureRecord extends Modal {
	fields: DataField[];
	component: EditRecord;
	onSave: (record: DataRecord) => void;
	defaults?: DataRecord;

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
