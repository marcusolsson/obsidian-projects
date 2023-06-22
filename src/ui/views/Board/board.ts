import { get } from "svelte/store";

import {
  isNumber,
  isString,
  type DataRecord,
  type DataField,
  DataFieldType,
} from "src/lib/dataframe/dataframe";
import { notEmpty } from "src/lib/helpers";
import { i18n } from "src/lib/stores/i18n";
import type { ColumnSettings } from "./types";

export function getFieldByName(
  fields: DataField[],
  name: string
): DataField | undefined {
  return fields.find((field) => name === field.name);
}

export function getFieldsByType(
  fields: DataField[],
  ...types: DataFieldType[]
) {
  return fields
    .filter((field) => !field.repeated)
    .filter((field) => types.includes(field.type));
}

export function unique(records: DataRecord[], fieldName: string): string[] {
  const keys = records
    .map((record) => record.values[fieldName])
    .map((value) => (value && isNumber(value) ? value.toLocaleString() : value))
    .map((value) => (value && isString(value) ? value : null))
    .filter(notEmpty);

  const set = new Set(keys);

  return [...set];
}

export function getColumns(
  records: DataRecord[],
  columnSettings: ColumnSettings,
  field?: DataField
) {
  const groupedRecords = groupRecordsByField(records, field?.name);

  const columns = new Set<string>(
    Object.entries(groupedRecords).map((entry) => entry[0])
  );

  if (field?.type === DataFieldType.String) {
    for (const option of field?.typeConfig?.options ?? []) {
      columns.add(option);
    }
  }

  return [...columns]
    .sort((a, b) => {
      const aweight = columnSettings[a]?.weight ?? 0;
      const bweight = columnSettings[b]?.weight ?? 0;

      if (aweight < bweight) {
        return -1;
      } else if (aweight > bweight) {
        return 1;
      } else {
        return 0;
      }
    })
    .map((column) => ({
      id: column,
      records: groupedRecords[column] ?? [],
    }));
}

function groupRecordsByField(
  records: DataRecord[],
  fieldName: string | undefined
): Record<string, Array<DataRecord>> {
  const noStatus = get(i18n).t("views.board.no-status");

  if (!fieldName) {
    return { [noStatus]: records };
  }

  const keys = unique(records, fieldName);

  const res: Record<string, Array<DataRecord>> = {
    [noStatus]: [],
  };
  for (const key of keys) {
    res[key] = [];
  }

  records.forEach((record) => {
    const value = record.values[fieldName];

    if (value && isString(value)) {
      res[value]?.push(record);
    } else if (value && isNumber(value)) {
      res[value.toLocaleString()]?.push(record);
    } else {
      res[noStatus]?.push(record);
    }
  });

  if (!res[noStatus]?.length) {
    delete res[noStatus];
  }

  return res;
}
