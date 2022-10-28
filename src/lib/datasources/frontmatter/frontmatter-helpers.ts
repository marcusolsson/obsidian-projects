import { isRawLink, type DataRecord, type Link } from "../../data";

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
        return [field, isRawLink(value) ? parseRawLink(value, "") : value];
      })
    ),
  };
}

/**
 * parseRawLink parses internal links in the front matter.
 *
 * Values in the form of "[[My note]]" get parsed as a two-dimensional array
 * with a single string value.
 */
function parseRawLink(
  rawLink: Array<Array<string>>,
  sourcePath: string
): Link | undefined {
  if (rawLink[0]) {
    const text = rawLink[0][0];

    if (text) {
      const split = text.split("|");

      const linkText = split[0] ?? "";

      const link: Link = {
        linkText,
        sourcePath,
      };

      return split[1] ? { ...link, displayName: split[1] } : link;
    }
  }
  return undefined;
}
