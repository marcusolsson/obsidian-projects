import { isStringLink, type DataRecord, type Link } from "../../../lib/data";

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
    values: Object.fromEntries(
      Object.entries(values).map(([field, value]) => {
        return [
          field,
          isStringLink(value) ? parseStringLink(value, "") : value,
        ];
      })
    ),
  };
}

function parseStringLink(rawLink: string, sourcePath: string): Link {
  const linkText = extractLinkText(rawLink);

  return {
    linkText,
    sourcePath,
  };
}

function extractLinkText(val: string): string {
  return val.replace(/\[\[(.*)\]\]/m, (_match, p1) => p1);
}
