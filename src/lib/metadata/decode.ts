import { Platform } from "obsidian";
import { parse } from "yaml";

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

export function parseYaml(data: string): Record<string, any> {
  return (
    parse(preprocessYaml(data), (_key, value) => {
      if (typeof value === "string") {
        return unquoteInternalLinks(value);
      }
      return value;
    }) || {}
  );
}

/**
 * preprocessYaml prepares YAML content for parsing.
 *
 * Surrounds internal links with quotes to parse them as strings instead of
 * arrays.
 */
export function preprocessYaml(data: string): string {
  // TODO: The regular expression below uses negative lookbehind, which isn't
  // supported on iOS. For now, let's exit early to avoid undefined behavior.
  if (Platform.isSafari) {
    throw new Error(
      "Negative lookbehind in regular expressions isn't supported on iOS"
    );
  }

  const nonQuotedInternalLinks = /(?<!\")(\[\[.*\]\])(?!\")$/g;

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
