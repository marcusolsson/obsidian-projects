import { parse, stringify } from "yaml";

/**
 * decodeFrontMatter returns metadata from a note with YAML front matter.
 */
export function decodeFrontMatter(data: string): Record<string, any> {
  const delim = "---";

  const startPosition = data.indexOf(delim) + delim.length;
  const endPosition = data.slice(startPosition).indexOf(delim) + startPosition;

  const isStart = data.slice(0, startPosition).trim() === delim;
  const hasFrontMatter = isStart && endPosition > startPosition;

  return hasFrontMatter
    ? parseYaml(data.slice(startPosition, endPosition))
    : {};
}

/**
 * encodeFrontMatter updates the front matter of a note.
 *
 * @param data is the current content of the note, including front matter.
 * @param frontmatter is the front matter to add to the note.
 * @returns data with the updated front matter.
 */
export function encodeFrontMatter(
  data: string,
  frontmatter: Record<string, any>
): string {
  const delim = "---";

  const startPosition = data.indexOf(delim) + delim.length;
  const endPosition = data.slice(startPosition).indexOf(delim) + startPosition;

  const isStart = data.slice(0, startPosition).trim() === delim;
  const hasFrontMatter = isStart && endPosition > startPosition;

  if (Object.entries(frontmatter).length) {
    return hasFrontMatter
      ? data.slice(0, startPosition + 1) +
          stringifyYaml(frontmatter) +
          data.slice(endPosition)
      : delim + "\n" + stringifyYaml(frontmatter) + delim + "\n\n" + data;
  }

  return hasFrontMatter
    ? data.slice(0, startPosition - delim.length) +
        data.slice(endPosition + delim.length + 1)
    : data;
}

export function parseYaml(data: string): Record<string, any> {
  return parse(preprocessYaml(data), (_key, value) => {
    if (typeof value === "string") {
      return unquoteInternalLinks(value);
    }
    return value;
  });
}

/**
 * preprocessYaml prepares YAML content for parsing.
 *
 * Surrounds internal links with quotes to parse them as strings instead of
 * arrays.
 */
export function preprocessYaml(data: string): string {
  const nonQuotedInternalLinks = /(?<!\")(\[\[.*\]\])(?!\")/g;

  // Uses negative lookbehind, which isn't supported on iOS.
  const quoteInternalLinks = (line: string) =>
    line.replace(nonQuotedInternalLinks, (_match, p1) => '"' + p1 + '"');

  return data.split("\n").map(quoteInternalLinks).join("\n");
}

/**
 * unquoteInternalLinks converts a "[[Link]]" to [[Link]].
 */
function unquoteInternalLinks(value: string) {
  return value.replace(/\"(\[\[.*\]\])\"/g, (_match, p1) => p1);
}

/**
 * stringifyYaml converts a value to YAML.
 */
export function stringifyYaml(value: any): string {
  return postprocessYaml(stringify(value));
}

/**
 * postprcessYaml removes quotes from single-line string properties.
 */
function postprocessYaml(value: string): string {
  const quotedProperties = /^(.*):\s*"(.*)"$/gm;
  return value.replace(quotedProperties, (_match, p1, p2) => p1 + ": " + p2);
}
