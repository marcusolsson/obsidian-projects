import { get } from "svelte/store";

import { isNumber, isString, type DataRecord } from "src/lib/dataframe/dataframe";
import { notEmpty } from "src/lib/helpers";
import { i18n } from "src/lib/stores/i18n";

export function unique(records: DataRecord[], fieldName: string): string[] {
  const keys = records
    .map((record) => record.values[fieldName])
    .map((value) => (value && isNumber(value) ? value.toLocaleString() : value))
    .map((value) => (value && isString(value) ? value : null))
    .filter(notEmpty);

  const set = new Set(keys);

  return [...set];
}

export function groupRecordsByField(
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
