import { TAbstractFile, TFile, type Plugin } from "obsidian";
import { get } from "svelte/store";
import { capabilities } from "./lib/stores/capabilities";
import {} from "obsidian-dataview";
import { dataFrame, dataSource } from "./lib/stores/dataframe";

// registerFileEvents keeps the file index up-to-date while plugin is running.
export function registerFileEvents(plugin: Plugin) {
  // Use Dataview as index if enabled.
  if (get(capabilities).dataview) {
    plugin.registerEvent(
      plugin.app.metadataCache.on(
        // @ts-expect-error
        "dataview:metadata-change",
        async (type: string, file: TAbstractFile, oldPath: string) => {
          if (file instanceof TFile) {
            const source = get(dataSource);
            if (source?.includes(file.path)) {
              switch (type) {
                case "update":
                  dataFrame.merge(
                    await source.queryOne(file, get(dataFrame).fields)
                  );
                  break;
                case "delete":
                  dataFrame.deleteRecord(file.path);
                  break;
                case "rename":
                  dataFrame.deleteRecord(oldPath);
                  dataFrame.merge(
                    await source.queryOne(file, get(dataFrame).fields)
                  );
                  break;
              }
            }
          }
        }
      )
    );
  } else {
    plugin.registerEvent(
      plugin.app.vault.on("create", async (file) => {
        if (file instanceof TFile) {
          const source = get(dataSource);
          if (source?.includes(file.path)) {
            dataFrame.merge(await source.queryOne(file, get(dataFrame).fields));
          }
        }
      })
    );

    plugin.registerEvent(
      plugin.app.vault.on("rename", async (file, oldPath) => {
        if (file instanceof TFile) {
          const source = get(dataSource);
          if (source?.includes(file.path)) {
            dataFrame.deleteRecord(oldPath);
            dataFrame.merge(await source.queryOne(file, get(dataFrame).fields));
          }
        }
      })
    );

    plugin.registerEvent(
      plugin.app.vault.on("delete", (file) => {
        if (file instanceof TFile) {
          const source = get(dataSource);
          if (source?.includes(file.path)) {
            dataFrame.deleteRecord(file.path);
          }
        }
      })
    );

    plugin.registerEvent(
      plugin.app.metadataCache.on("changed", async (file) => {
        if (file instanceof TFile) {
          const source = get(dataSource);
          if (source?.includes(file.path)) {
            dataFrame.merge(await source.queryOne(file, get(dataFrame).fields));
          }
        }
      })
    );
  }
}
