import { TAbstractFile, TFile, type Plugin } from "obsidian";
import { get } from "svelte/store";
import {} from "obsidian-dataview";

import { capabilities } from "src/lib/stores/capabilities";
import { dataFrame, dataSource } from "src/lib/stores/dataframe";
import { DataviewDataSource } from "./lib/datasources/dataview/dataview";

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
            if (!source) {
              return;
            }

            // This is a hack to trigger the Dataview query to run again.
            if (source instanceof DataviewDataSource) {
              dataSource.set(source);
              return;
            }

            const recordExists = !!get(dataFrame).records.find(
              (record) => record.id === file.path
            );

            if (source.includes(file.path)) {
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
            } else if (recordExists) {
              dataFrame.deleteRecord(file.path);
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
          if (!source) {
            return;
          }

          const recordExists = !!get(dataFrame).records.find(
            (record) => record.id === file.path
          );

          if (source.includes(file.path)) {
            dataFrame.merge(await source.queryOne(file, get(dataFrame).fields));
          } else if (recordExists) {
            dataFrame.deleteRecord(file.path);
          }
        }
      })
    );
  }
}
