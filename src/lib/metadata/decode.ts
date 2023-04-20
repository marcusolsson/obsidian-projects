import { either as E, function as F } from "fp-ts";
import { parse } from "yaml";

/**
 * decodeFrontMatter returns metadata from a note with YAML front matter.
 */
export function decodeFrontMatter(
  data: string
): E.Either<Error, Record<string, any>> {
  const delim = "---";

  const startPosition = data.indexOf(delim) + delim.length;
  const endPosition = data.slice(startPosition).indexOf(delim) + startPosition;

  const isStart = data.slice(0, startPosition).trim() === delim;
  const hasFrontMatter = isStart && endPosition > startPosition;

  return hasFrontMatter
    ? parseYaml(data.slice(startPosition, endPosition))
    : E.right({});
}

export function parseYaml(data: string): E.Either<Error, Record<string, any>> {
  return F.pipe(
    data,
    (data) => E.right(preprocessYaml(data)),
    E.chain(parseRawYaml)
  );
}

function parseRawYaml(data: string): E.Either<Error, Record<string, any>> {
  return E.tryCatch(
    () =>
      parse(data, (_key, value) => {
        if (typeof value === "string") {
          return unquoteInternalLinks(value);
        }
        return value;
      }) || {},
    (e) => (e instanceof Error ? e : new Error("unknown error"))
  );
}

/**
 * preprocessYaml prepares YAML content for parsing.
 *
 * Surrounds internal links with quotes to parse them as strings instead of
 * arrays.
 */
export function preprocessYaml(data: string): string {
  const internalLinks = /(\"?\!?\[\[.*\]\]\"?)/g;

  const quoteInternalLinks = (line: string) =>
    line.replace(internalLinks, (_match, p1) => {
      if (p1.startsWith('"') && p1.endsWith('"')) {
        return p1; // quoted
      }
      return '"' + p1 + '"'; // unquoted
    });

  return data.split("\n").map(quoteInternalLinks).join("\n");
}

/**
 * unquoteInternalLinks converts a "[[Link]]" to [[Link]].
 */
function unquoteInternalLinks(value: string) {
  return value.replace(/\"(\!?\[\[.*\]\])\"/g, (_match, p1) => p1);
}
