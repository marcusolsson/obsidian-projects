import type { App } from "obsidian";
import { get } from "svelte/store";
import type { DataApi } from "./api";
import type { DataField, DataRecord, DataSource } from "./data";
import { filesFromRecords } from "./obsidian";
import { dataFrame } from "./stores/dataframe";

/**
 * ViewApi provides an write API for views.
 */
export class ViewApi {
	constructor(
		readonly app: App,
		readonly dataSource: DataSource,
		readonly dataApi: DataApi
	) {}

	addRecord(record: DataRecord, templatePath: string) {
		if (this.dataSource.includes(record.id)) {
			dataFrame.addRecord(record);
		}
		this.dataApi.createNote(record, templatePath);
	}

	updateRecord(record: DataRecord, fields: DataField[]) {
		if (this.dataSource.includes(record.id)) {
			dataFrame.updateRecord(record);
		}
		this.dataApi.updateRecord(fields, record);
	}

	deleteRecord(recordId: string) {
		if (this.dataSource.includes(recordId)) {
			dataFrame.deleteRecord(recordId);
		}
		this.dataApi.deleteRecord(recordId);
	}

	renameField(from: string, to: string) {
		dataFrame.renameField(from, to);
		this.dataApi.renameField(
			filesFromRecords(this.app, get(dataFrame).records),
			from,
			to
		);
	}

	deleteField(field: string) {
		dataFrame.deleteField(field);
		this.dataApi.deleteField(
			filesFromRecords(this.app, get(dataFrame).records),
			field
		);
	}
}
