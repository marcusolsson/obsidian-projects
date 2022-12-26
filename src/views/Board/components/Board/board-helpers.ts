import {
  isDate,
  isNumber,
  type DataField,
  type DataRecord,
  type DataValue,
  type Optional,
} from "../../../../lib/data";

export function getPrioritizedRecords(
  records: DataRecord[],
  groupByPriority?: DataField
): DataRecord[] {
  const res = records.filter((record) => {
    if (!groupByPriority) {
      return false;
    }

    return (
      isNumber(record.values[groupByPriority.name]) ||
      isDate(record.values[groupByPriority.name])
    );
  });

  res.sort((a, b) => {
    if (groupByPriority) {
      const aval: Optional<DataValue> = a.values[groupByPriority.name];
      const bval: Optional<DataValue> = b.values[groupByPriority.name];

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
  groupByPriority?: DataField
): DataRecord[] {
  const res = records.filter((record) => {
    if (!groupByPriority) {
      return false;
    }

    return !(
      isNumber(record.values[groupByPriority.name]) ||
      isDate(record.values[groupByPriority.name])
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

export function getDisplayName(recordId: string): string {
  const basename = getBasename(recordId);
  return basename.slice(0, basename.lastIndexOf("."));
}

// This exists in the `path` Node.js package, but reimplementing for mobile support.
function getBasename(str: string) {
  const lastSlash = str.lastIndexOf("/");

  if (lastSlash < 0) {
    return str;
  }

  return str.slice(lastSlash + 1);
}
