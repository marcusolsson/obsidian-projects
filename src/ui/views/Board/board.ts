import { get } from "svelte/store";

import {
  DataFieldType,
  isNumber,
  isString,
  type DataField,
  type DataRecord,
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
  grouByField?: DataField,
  orderSyncField?: DataField,
  sortByCustomOrder?: boolean
) {
  const groupedRecords = groupRecordsByField(records, grouByField?.name);

  let predefs = new Set<string>();
  if (grouByField?.type === DataFieldType.String) {
    predefs = new Set(grouByField.typeConfig?.options);
  }

  const columns = new Set([...Object.keys(groupedRecords), ...predefs]);

  return [...columns]
    .sort((a, b) => {
      const aweight = columnSettings[a]?.weight ?? 0;
      const bweight = columnSettings[b]?.weight ?? 0;

      if (aweight < bweight) {
        return -1;
      } else if (aweight > bweight) {
        return 1;
      } else {
        const noStatus = get(i18n).t("views.board.no-status");
        if (a === noStatus) return -1;
        if (b === noStatus) return 1;

        const aIndex = [...predefs].indexOf(a);
        const bIndex = [...predefs].indexOf(b);

        if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
        else if (aIndex >= 0) return -1;
        else if (bIndex >= 0) return 1;
        else return a.localeCompare(b, undefined, { numeric: true });
      }
    })
    .map((column) => {
      const records = groupedRecords[column] ?? [];
      if (sortByCustomOrder && records.length > 0) {
        applyCustomRecordOrder(records, columnSettings[column], orderSyncField);
      }
      return {
        id: column,
        records,
        collapse: columnSettings[column]?.collapse ?? false,
        pinned: grouByField?.typeConfig?.options?.includes(column) ?? false,
      };
    });
}

function groupRecordsByField(
  records: DataRecord[],
  fieldName: string | undefined
): Record<string, Array<DataRecord>> {
  const noStatus = get(i18n).t("views.board.no-status");

  if (!fieldName) {
    return { [noStatus]: [...records] };
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

/**
 * Sorts records in place according to either order sync field if set, or to
 * order of records in the column settings. This method mutates the array and
 * returns a reference to the same array.
 *
 * @param records - The records to be sorted.
 * @param columnSettings - The column settings for sorting the records.
 * @param orderSyncField - The priority field for sorting the records.
 * @returns The sorted records.
 */
function applyCustomRecordOrder(
  records: DataRecord[],
  columnSettings?: ColumnSettings[string],
  orderSyncField?: DataField
): DataRecord[] {
  let getWeight: (record: DataRecord) => number;

  if (orderSyncField?.name && orderSyncField.type === DataFieldType.Number) {
    getWeight = (record) => {
      const weight = record.values[orderSyncField.name];
      return isNumber(weight) ? weight : Number.POSITIVE_INFINITY;
    };
  } else if (columnSettings) {
    const weights = Object.fromEntries(
      (columnSettings?.records ?? []).map((r, i) => [r, i])
    );
    getWeight = (record: DataRecord) =>
      weights[record.id] ?? Number.POSITIVE_INFINITY;
  } else {
    return records;
  }

  return records.sort((a, b) => getWeight(a) - getWeight(b));
}
