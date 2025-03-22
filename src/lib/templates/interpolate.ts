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
  // List of allowed template functions
  const allowedFunctions = new Set(Object.keys(data));
  
  return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, name) => {
    // Validate and sanitize the function name
    const [funcRaw, argRaw] = name.split(/:(.*)/s);
    const func = funcRaw?.trim();
    const arg = argRaw?.trim();
    
    // Only allow execution of functions that are in the provided data object
    if (!func || !allowedFunctions.has(func)) {
      return "";
    }
    
    const f = data[func];
    return f ? f(arg) : "";
  });
}
