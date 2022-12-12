import dayjs from "dayjs";
import { App, TFile } from "obsidian";
import type { DataValue, Optional } from "src/lib/data";

/**
 * standardizeValues converts a Dataview data structure of values to the common
 * DataValue format.
 */
export function standardizeValues(
  app: App,
  values: Record<string, any>
): Record<string, Optional<DataValue>> {
  const res: Record<string, Optional<DataValue>> = {};

  Object.keys(values).forEach((field) => {
    const value = values[field];

    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      res[field] = value;
    } else if (typeof value === "object") {
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
