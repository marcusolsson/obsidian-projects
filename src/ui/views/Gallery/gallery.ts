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
    if (coverPath.startsWith("http://") || coverPath.startsWith("https://")) {
      return coverPath;
    }
    return getResourcePathFromLinkText(app, coverPath);
  }

  return null;
}

function getResourcePathFromLinkText(app: App, text: string) {
  const linkText = parseObsidianLink(text)?.linkText || text;

  const file = app.metadataCache.getFirstLinkpathDest(linkText, "");

  if (file) {
    if (["png", "jpg", "jpeg", "gif", "bmp", "svg"].includes(file.extension)) {
      return app.vault.getResourcePath(file);
    }
  }

  return null;
}
