import path from "path";
import {
  isDate,
  isNumber,
  type DataRecord,
  type OptionalDataValue,
} from "../../../../lib/data";

export function getPrioritizedRecords(
  records: DataRecord[],
  groupByPriority?: string
): DataRecord[] {
  const res = records.filter((record) => {
    if (!groupByPriority) {
      return false;
    }

    return (
      isNumber(record.values[groupByPriority]) ||
      isDate(record.values[groupByPriority])
    );
  });

  res.sort((a, b) => {
    if (groupByPriority) {
      const aval: OptionalDataValue = a.values[groupByPriority];
      const bval: OptionalDataValue = b.values[groupByPriority];

      if (isNumber(aval) && isNumber(bval)) {
        const value = aval - bval;
        if (value) {
          return value;
        }
      }

      if (isDate(aval) && isDate(bval)) {
        const value = aval.getTime() - bval.getTime();
        if (value) {
          return value;
        }
      }

      return a.id.localeCompare(b.id);
    }

    return 0;
  });

  return res;
}

export function getUnprioritizedRecords(
  records: DataRecord[],
  groupByPriority?: string
): DataRecord[] {
  const res = records.filter((record) => {
    if (!groupByPriority) {
      return false;
    }

    return !(
      isNumber(record.values[groupByPriority]) ||
      isDate(record.values[groupByPriority])
    );
  });

  res.sort((a, b) => {
    if (groupByPriority) {
      const aval = a.id;
      const bval = b.id;

      return aval.localeCompare(bval);
    }

    return 0;
  });

  return res;
}

export function getDisplayName(record: DataRecord): string {
  const basename = path.basename(record.id);
  return basename.slice(0, basename.lastIndexOf("."));
}
