import { get } from "svelte/store";

import type {
  DataField,
  DataRecord,
  DataValue,
  Optional,
} from "./dataframe/dataframe";
import type { DataApi } from "./dataApi";
import { dataFrame } from "./stores/dataframe";
import type { DataSource } from "./datasources";

/**
 * ViewApi provides an write API for views.
 */
export class ViewApi {
  constructor(readonly dataSource: DataSource, readonly dataApi: DataApi) {}

  addRecord(record: DataRecord, fields: DataField[], templatePath: string) {
    if (this.dataSource.includes(record.id)) {
      dataFrame.addRecord(record);
    }
    this.dataApi.createNote(record, fields ?? [], templatePath);
  }

  updateRecord(record: DataRecord, fields: DataField[]) {
    if (this.dataSource.includes(record.id)) {
      dataFrame.updateRecord(record);
    }
    this.dataApi.updateRecord(fields, record);
  }

  async updateRecords(records: DataRecord[], fields: DataField[]) {
    const rs = records.filter((r) => this.dataSource.includes(r.id));
    if (rs) dataFrame.updateRecords(rs);
    await this.dataApi.updateRecords(fields, records);
  }

  deleteRecord(recordId: string) {
    if (this.dataSource.includes(recordId)) {
      dataFrame.deleteRecord(recordId);
    }
    this.dataApi.deleteRecord(recordId);
  }

  addField(field: DataField, value: Optional<DataValue>, position?: number) {
    dataFrame.addField(field, position);

    this.dataApi.addField(
      get(dataFrame).records.map((record) => record.id),
      field,
      value
    );
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
