import { TFile, type App } from "obsidian";
import { get } from "svelte/store";
import { doDeleteField, doUpdateRecord } from "./api-helpers";
import type { DataRecord } from "./data";
import { fileIndex } from "./stores/file-index";

export class RecordApi {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	async updateRecord(record: DataRecord): Promise<void> {
		const file = this.app.vault.getAbstractFileByPath(record.path);

		if (file instanceof TFile) {
			this.updateFile(file, (data) => doUpdateRecord(data, record));
		}
	}

	async deleteField(name: string) {
		for (let pair of Object.entries(get(fileIndex).files)) {
			this.updateFile(pair[1], (data) => doDeleteField(data, name));
		}
	}

	async updateFile(file: TFile, cb: (data: string) => string) {
		const data = await this.app.vault.read(file);
		await this.app.vault.modify(file, cb(data));
	}

	async deleteRecord(path: string) {
		const file = get(fileIndex).files[path];

		if (file) {
			this.app.vault.trash(file, true);
		}
	}
}
