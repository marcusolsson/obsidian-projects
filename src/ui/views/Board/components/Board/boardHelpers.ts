export function getDisplayName(recordId: string): string {
  const basename = getBasename(recordId);
  return basename.slice(0, basename.lastIndexOf("."));
}

// This exists in the `path` Node.js package, but reimplementing for mobile support.
function getBasename(str: string) {
  const lastSlash = str.lastIndexOf("/");

  if (lastSlash < 0) {
    return str;
  }

  return str.slice(lastSlash + 1);
}
