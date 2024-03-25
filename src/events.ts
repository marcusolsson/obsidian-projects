import { get } from "svelte/store";
import { dataFrame, dataSource } from "src/lib/stores/dataframe";
import type { IFileSystemWatcher } from "./lib/filesystem/filesystem";
import { DataviewDataSource } from "./lib/datasources/dataview/datasource";
import type { DataSource } from "./lib/datasources";

/**
 * registerFileEvents keeps the file index up-to-date while plugin is running.
 */
export function registerFileEvents(watcher: IFileSystemWatcher) {
  watcher.onCreate(async (file) => {
    withDataSource(async (source) => {
      if (source.includes(file.path)) {
        dataFrame.merge(await source.queryOne(file, get(dataFrame).fields));
      }
    });
  });
  watcher.onRename(async (file, oldPath) => {
    withDataSource(async (source) => {
      if (source.includes(file.path)) {
        dataFrame.deleteRecord(oldPath);
        dataFrame.merge(await source.queryOne(file, get(dataFrame).fields));
      } else if (source.includes(oldPath)) {
        dataFrame.deleteRecord(oldPath);
      }
    });
  });

  watcher.onDelete(async (file) => {
    withDataSource(async (source) => {
      const recordExists = !!get(dataFrame).records.find(
        (record) => record.id === file.path
      );

      if (recordExists) {
        dataFrame.deleteRecord(file.path);
      }
    });
  });

  watcher.onChange(async (file) => {
    withDataSource(async (source) => {
      const recordExists = !!get(dataFrame).records.find(
        (record) => record.id === file.path
      );

      if (source.includes(file.path)) {
        dataFrame.merge(await source.queryOne(file, get(dataFrame).fields));
      } else if (recordExists) {
        dataFrame.deleteRecord(file.path);
      }
    });
  });
}

/**
 * withDataSource is a helper function to access the current data source.
 */
function withDataSource(callback: (source: DataSource) => Promise<void>) {
  const source = get(dataSource);
  if (!source) {
    return;
  }

  // This is a hack to trigger the Dataview query to run again when a file changes.
  if (source instanceof DataviewDataSource) {
    dataSource.set(source);
    return;
  }

  return callback(source);
}
