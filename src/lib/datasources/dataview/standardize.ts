import dayjs from "dayjs";
import type { Link } from "obsidian-dataview";
import {
  isRepeatedDataValue,
  type DataValue,
  type Optional,
} from "src/lib/dataframe/dataframe";

/**
 * standardizeValues converts a Dataview data structure of values to the common
 * DataValue format.
 */
export function standardizeValues(
  values: Record<string, any>
): Record<string, Optional<DataValue>> {
  const res: Record<string, Optional<DataValue>> = {};

  Object.keys(values).forEach((field) => {
    const value = values[field];

    if (!value) {
      return;
    }

    if (isRepeatedDataValue(value)) {
      res[field] = value;
    } else if (typeof value === "object") {
      if ("path" in value && "display" in value) {
        res[field] = (value as Link).toString();
      }
      if ("ts" in value) {
        res[field] = dayjs(value.ts).format("YYYY-MM-DD");
      }
    } else {
      res[field] = value;
    }
  });

  return res;
}
