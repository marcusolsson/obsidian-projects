import type { App } from "obsidian";
import type { DataApi } from "../lib/api";
import type { DataField, DataRecord, DataSource } from "../lib/data";
import { filesFromRecords } from "../lib/obsidian";
import { dataFrame } from "../lib/stores/dataframe";
import { get } from "svelte/store";

/**
 * ViewApi provides an write API for views.
 */
export class ViewApi {
	app: App;
	dataSource: DataSource;
	dataApi: DataApi;

	constructor(app: App, dataSource: DataSource, dataApi: DataApi) {
		this.app = app;
		this.dataSource = dataSource;
		this.dataApi = dataApi;
	}

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
