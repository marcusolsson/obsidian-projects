import dayjs from "dayjs";
import type { OptionalDataValue } from "../../data";
import { App, TFile } from "obsidian";

/**
 * standardizeValues converts a Dataview data structure of values to the common
 * DataValue format.
 */
export function standardizeValues(
  app: App,
  values: Record<string, any>
): Record<string, OptionalDataValue> {
  const res: Record<string, OptionalDataValue> = {};

  Object.keys(values).forEach((field) => {
    const value = values[field];

    if (!value) {
      return;
    }

    if (typeof value === "object") {
      if ("path" in value && "display" in value) {
        const file = app.vault.getAbstractFileByPath(value.path);

        if (file instanceof TFile) {
          const linkText = app.metadataCache.fileToLinktext(file, "", true);

          res[field] = {
            displayName: value.display ?? linkText,
            fullPath: value.path,
            linkText,
            sourcePath: "",
          };
        } else {
          res[field] = {
            displayName: value.display ?? value.path,
            fullPath: value.path,
            linkText: value.path,
            sourcePath: "",
          };
        }
      }

      if ("ts" in value) {
        res[field] = dayjs(value.ts).format("YYYY-MM-DD");
      }
    } else {
      res[field] = value;
    }
  });

  return res;
}
