import { either as E, function as F } from "fp-ts";
import { stringify } from "yaml";
import { parseYaml } from "./decode";

/**
 * Updates the front matter of a note.
 *
 * @param data - The current content of the note, including front matter.
 * @param frontmatter - The front matter to add to the note.
 * @returns Data with the updated front matter.
 */
export function encodeFrontMatter(
  data: string,
  frontmatter: Record<string, any>,
  defaultStringType: "PLAIN" | "QUOTE_DOUBLE"
): E.Either<Error, string> {
  const delim = "---";

  const startPosition = data.indexOf(delim) + delim.length;
  const endPosition = data.slice(startPosition).indexOf(delim) + startPosition;

  const isStart = data.slice(0, startPosition).trim() === delim;
  const hasFrontMatter = isStart && endPosition > startPosition;

  return F.pipe(
    parseYaml(hasFrontMatter ? data.slice(startPosition, endPosition) : ""),
    E.map((existing) => Object.assign({}, existing, frontmatter)),
    E.map((fm) => {
      if (Object.entries(fm).length) {
        const d = stringifyYaml(fm, defaultStringType);

        return hasFrontMatter
          ? data.slice(0, startPosition + 1) + d + data.slice(endPosition)
          : delim + "\n" + d + delim + "\n\n" + data;
      }

      return hasFrontMatter
        ? data.slice(0, startPosition - delim.length) +
            data.slice(endPosition + delim.length + 1)
        : data;
    })
  );
}

/**
 * stringifyYaml converts a value to YAML.
 */
export function stringifyYaml(
  value: any,
  defaultStringType: "PLAIN" | "QUOTE_DOUBLE" = "PLAIN"
): string {
  return F.pipe(value, (value) =>
    stringify(value, {
      lineWidth: 0,
      nullStr: "",
      defaultStringType: defaultStringType,
      defaultKeyType: "PLAIN",
    })
  );
}
