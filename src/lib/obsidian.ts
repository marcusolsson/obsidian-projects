import {
  App,
  Platform,
  TFile,
  TFolder,
  Vault,
  type TAbstractFile,
} from "obsidian";

import type { DataRecord } from "./dataframe/dataframe";

/**
 * isTFile is a convenience function for filtering arrays of TAbstractFile.
 */
export function isTFile(value: TAbstractFile | null): value is TFile {
  return value instanceof TFile;
}

/**
 * isTFolder is a convenience function for filtering arrays of TAbstractFile.
 */
export function isTFolder(value: TAbstractFile | null): value is TFolder {
  return value instanceof TFolder;
}

/**
 * filesFromRecords converts an array of records to their corresponding TFiles.
 */
export function filesFromRecords(app: App, records: DataRecord[]): TFile[] {
  return records
    .map((record) => record.id)
    .map((path) => {
      return app.vault.getAbstractFileByPath(path);
    })
    .filter(isTFile);
}

/**
 * getFilesInFolder recursively looks for all files in a given folder.
 */
export function getFilesInFolder(folder: TFolder): TFile[] {
  const result: TFile[] = [];
  Vault.recurseChildren(folder, (file) => {
    if (file instanceof TFile) {
      result.push(file);
    }
  });
  return result;
}

/**
 * getNotesInFolder recursively looks for all Markdown files in a given folder.
 */
export function getNotesInFolder(folder: TFolder): TFile[] {
  return getFilesInFolder(folder).filter((file) => file.extension === "md");
}

/**
 * getFoldersInFolder recursively looks for all folders under a given folder.
 */
export function getFoldersInFolder(folder: TFolder): TFolder[] {
  const result: TFolder[] = [];
  Vault.recurseChildren(folder, (file) => {
    if (file instanceof TFolder) {
      result.push(file);
    }
  });
  return result;
}

/**
 * isValidPath returns whether a file path is a valid file name depending on the
 * current OS.
 */
export function isValidPath(path: string): boolean {
  const expr = getIllegalCharacterSet();

  if (!expr) {
    return true;
  }

  return !expr.test(path);
}

function getIllegalCharacterSet(): RegExp | undefined {
  if (Platform.isMacOS) {
    return /[\\\/\|\#\^\[\]]/;
  } else if (Platform.isDesktopApp) {
    // Windows
    return /[\\\/\|\:\<\>\*\"\?]/;
  }
  return undefined;
}
