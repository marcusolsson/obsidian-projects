/**
 * Interpolates occurrences of double curly braces.
 *
 * The data parameter contains a map of available template variables, for
 * example `date` and `time`.
 *
 * The value of each template variable is a function with an optional argument.
 * The argument is any text after an optional colon, e.g. \{\{date:YYYY-MM-DD\}\}.
 */
export function interpolateTemplate(
  template: string,
  data: Record<string, (arg?: string) => string>
): string {
  return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, name) => {
    const [func, arg] = name.split(/:(.*)/s);
    const f = data[func];
    return f ? f(arg) : "";
  });
}
