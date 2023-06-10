import { normalizePath } from "obsidian";
import type { IFileSystem } from "src/lib/filesystem/filesystem";
import type {
  ProjectDefinition,
  ProjectsPluginPreferences,
} from "src/settings/settings";

import { FrontMatterDataSource } from "../frontmatter/frontmatter";

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
    }

    return true;
  }
}

/**
 * Returns whether a folder contains a file path.
 *
 * Assumes both folder path and file path have been normalized.
 *
 * @param folderPath path to the root folder, e.g. Work
 * @param filePath path to the file to test, e.g. Work/Untitled.md
 * @returns
 */
function folderContainsPath(folderPath: string, filePath: string): boolean {
  const fileElements = filePath.split("/").slice(0, -1);
  const folderElement = folderPath.split("/").filter((el) => el);

  return fileElements.join("/") === folderElement.join("/");
}
