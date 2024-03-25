const wikiLinkRegExp = /^\!?\[\[(.*?)(\|(.*?))?\]\]$/;
const mdLinkRegExp = /^\!?\[([^\[]*)\]\((.*)\)$/;

export function parseObsidianLink(link: string): {
  linkText: string;
  displayName: string;
} | null {
  const wikiLink = link.match(wikiLinkRegExp);
  const mdLink = link.match(mdLinkRegExp);

  if (wikiLink) {
    return {
      linkText: wikiLink[1] || "",
      displayName: wikiLink[3] || "",
    };
  } else if (mdLink) {
    return {
      linkText: mdLink[2] || "",
      displayName: mdLink[1] || "",
    };
  } else {
    return null;
  }
}
