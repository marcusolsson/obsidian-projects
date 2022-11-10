import { stringify } from "yaml";

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
