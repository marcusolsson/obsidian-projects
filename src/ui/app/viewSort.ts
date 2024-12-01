import { produce } from "immer";
import {
  isNumber,
  isDate,
  isBoolean,
  type DataFrame,
} from "../../lib/dataframe/dataframe";
import type { SortDefinition, SortingCriteria } from "src/settings/settings";
import type { DataRecord } from "../../lib/dataframe/dataframe";

export function applySort(frame: DataFrame, sort: SortDefinition): DataFrame {
  return produce(frame, (draft) => {
    //@ts-ignore
    sortRecords(draft.records, sort);
  });
}

/**
 * Sorts records in place. This method mutates the array
 * and returns a reference to the same array.
 *
 * @param records - the records to be sorted
 * @param sort - the definition for sorting the records
 */
export function sortRecords(records: DataRecord[], sort: SortDefinition) {
  return records.sort((a, b): number => {
    let res = 0;

    const enabledCriteria = sort.criteria.filter((c) => c.enabled);
    for (const criteria of enabledCriteria) {
      res = sortCriteria(a, b, criteria);
      if (res !== 0) {
        break;
      }
    }

    return res;
  });
}

function isEmpty(value: any): boolean {
  return value === undefined || value === null;
}

function sortCriteria(
  a: DataRecord,
  b: DataRecord,
  criteria: SortingCriteria
): number {
  let aval = a.values[criteria.field];
  let bval = b.values[criteria.field];

  const isAsc = criteria.order === "asc";

  if (!isEmpty(aval) && isEmpty(bval)) return -1;
  if (isEmpty(aval) && !isEmpty(bval)) return 1;
  if (isEmpty(aval) && isEmpty(bval)) return 0;

  if (isNumber(aval) && isNumber(bval)) {
    return sortNumber(aval, bval, isAsc);
  }
  if (isDate(aval) && isDate(bval)) {
    return sortDate(aval, bval, isAsc);
  }
  if (isBoolean(aval) && isBoolean(bval)) {
    return sortBoolean(aval, bval, isAsc);
  }

  aval = aval?.toString().toLocaleLowerCase() ?? "";
  bval = bval?.toString().toLocaleLowerCase() ?? "";

  const nameLinkRegExp = /^\[\[(.*?)\|(.*?)\]\]$/;
  if (criteria.field === "name") {
    aval = aval.match(nameLinkRegExp)?.[2] || aval;
    bval = bval.match(nameLinkRegExp)?.[2] || bval;
  }

  return sortString(aval, bval, isAsc);
}

function sortNumber(a: number, b: number, asc: boolean): number {
  if (a < b) {
    return asc ? -1 : 1;
  }
  if (a > b) {
    return asc ? 1 : -1;
  }
  return 0;
}

function sortDate(a: Date, b: Date, asc: boolean): number {
  if (a.getTime() < b.getTime()) {
    return asc ? -1 : 1;
  }
  if (a.getTime() > b.getTime()) {
    return asc ? 1 : -1;
  }
  return 0;
}

function sortBoolean(a: boolean, b: boolean, asc: boolean): number {
  if (a === false && b === true) {
    return asc ? -1 : 1;
  }
  if (a === true && b === false) {
    return asc ? 1 : -1;
  }
  return 0;
}

function sortString(a: string, b: string, asc: boolean): number {
  return asc
    ? a.localeCompare(b, undefined, { numeric: true })
    : b.localeCompare(a, undefined, { numeric: true });
}
