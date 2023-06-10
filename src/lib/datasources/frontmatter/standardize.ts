import type { DataRecord } from "../../dataframe/dataframe";

/**
 * standardizeValues converts front matter YAML data to the common DataValue
 * format.
 */
export function standardizeRecord(
  id: string,
  values: Record<string, any>
): DataRecord {
  return {
    id,
    values,
  };
}
