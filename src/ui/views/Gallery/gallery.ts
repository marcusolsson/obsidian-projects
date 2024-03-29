import {
  isString,
  type DataField,
  type DataRecord,
} from "src/lib/dataframe/dataframe";
import { parseObsidianLink } from "./helpers";
import type { App } from "obsidian";

export function getCoverRealPath(
  app: App,
  record: DataRecord,
  coverField?: DataField
) {
  if (!coverField) {
    return null;
  }

  const coverPath = record.values[coverField.name];

  if (!coverPath) {
    return null;
  }

  if (isString(coverPath)) {
    return getResourcePathFromLinkText(app, coverPath);
  }

  return null;
}

function getResourcePathFromLinkText(app: App, text: string) {
  const linkText = parseObsidianLink(text)?.linkText || text;
  if (linkText.startsWith("http://") || linkText.startsWith("https://")) {
    return linkText;
  }

  const file = app.metadataCache.getFirstLinkpathDest(linkText, "");

  if (file) {
    if (
      ["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"].includes(
        file.extension
      )
    ) {
      return app.vault.getResourcePath(file);
    }
  }

  return null;
}
