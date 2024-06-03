import { normalizePath } from "obsidian";
import type { IFileSystem } from "src/lib/filesystem/filesystem";
import type {
  ProjectDefinition,
  ProjectsPluginPreferences,
} from "src/settings/settings";

import { FrontMatterDataSource } from "../frontmatter/datasource";

/**
 * FolderDataSource returns a collection of notes within a folder.
 */
export class FolderDataSource extends FrontMatterDataSource {
  constructor(
    readonly fileSystem: IFileSystem,
    project: ProjectDefinition,
    preferences: ProjectsPluginPreferences
  ) {
    super(fileSystem, project, preferences);
  }

  includes(path: string): boolean {
    if (this.project.dataSource.kind !== "folder") {
      return false;
    }

    if (this.project.excludedNotes?.includes(path)) {
      return false;
    }

    let projectPath = normalizePath(this.project.dataSource.config.path);

    if (projectPath === "/") {
      projectPath = "";
    }

    const normalizedPath = normalizePath(path);

    // No need to continue if file is not below the project path.
    if (!normalizedPath.startsWith(projectPath)) {
      return false;
    }

    if (!this.project.dataSource.config.recursive) {
      return folderContainsPath(projectPath, normalizedPath);
    } else {
      return folderContainsDeepPath(projectPath, normalizedPath);
    }
  }
}

/**
 * Returns whether a folder contains a file path.
 *
 * Assumes both folder path and file path have been normalized.
 *
 * @param folderPath - The path to the root folder, e.g. Work
 * @param filePath - The path to the file to test, e.g. Work/Untitled.md
 * @returns True if the folder contains the given file, else false
 */
function folderContainsPath(folderPath: string, filePath: string): boolean {
  const fileElements = filePath.split("/").slice(0, -1);
  const folderElements = folderPath.split("/").filter((el) => el);

  return fileElements.join("/") === folderElements.join("/");
}

/**
 * Returns whether a root folder contains a file path under a subfolder.
 *
 * Assumes both folder path and file path have been normalized.
 *
 * @param folderPath - The path to the root folder, e.g. Work
 * @param filePath - The path to the file to test, e.g. Work/Meetings/Untitled.md
 * @returns True if the file exists in any subfolder.
 */
function folderContainsDeepPath(folderPath: string, filePath: string): boolean {
  const fileElements = filePath.split("/").filter((el) => el);
  const folderElements = folderPath.split("/").filter((el) => el);

  if (fileElements.length <= folderElements.length) {
    return false;
  }

  return (
    fileElements.slice(0, folderElements.length).join("/") ===
    folderElements.join("/")
  );
}
