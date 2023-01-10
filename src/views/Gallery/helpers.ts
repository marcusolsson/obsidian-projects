const obsidianLinkRegExp = /^\[\[(.*?)(\|(.*?))?\]\]$/;

export function parseObsidianLink(link: string): {
  linkText: string;
  displayName: string;
} | null {
  const match = link.match(obsidianLinkRegExp);

  return match
    ? {
        linkText: match[1] || "",
        displayName: match[3] || "",
      }
    : null;
}
