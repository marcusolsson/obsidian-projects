import { get } from "svelte/store";

import type { DataField, DataRecord, DataSource } from "./data";
import type { DataApi } from "./data-api";
import { dataFrame } from "./stores/dataframe";

/**
 * ViewApi provides an write API for views.
 */
export class ViewApi {
  constructor(readonly dataSource: DataSource, readonly dataApi: DataApi) {}

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

  updateField(field: DataField, oldName?: string) {
    dataFrame.updateField(field, oldName);

    if (oldName) {
      this.dataApi.renameField(
        get(dataFrame).records.map((record) => record.id),
        oldName,
        field.name
      );
    }
  }

  deleteField(field: string) {
    dataFrame.deleteField(field);
    this.dataApi.deleteField(
      get(dataFrame).records.map((record) => record.id),
      field
    );
  }
}
