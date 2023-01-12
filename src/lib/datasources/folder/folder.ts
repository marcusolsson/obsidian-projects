import type { App } from "obsidian";

import type { ProjectDefinition } from "src/types";

import type { ProjectsPluginPreferences } from "src/main";
import { FrontMatterDataSource } from "../frontmatter/frontmatter";

export class FolderDataSource extends FrontMatterDataSource {
  constructor(
    readonly app: App,
    project: ProjectDefinition,
    preferences: ProjectsPluginPreferences
  ) {
    super(app, project, preferences);
  }

  includes(path: string): boolean {
    if (this.project.dataSource.kind !== "folder") {
      return false;
    }

    if (this.project.excludedNotes?.includes(path)) {
      return false;
    }

    const trimmedPath = this.project.dataSource.config.path.startsWith("/")
      ? this.project.dataSource.config.path.slice(1)
      : this.project.dataSource.config.path;

    // No need to continue if file is not below the project path.
    if (!path.startsWith(trimmedPath)) {
      return false;
    }

    if (!this.project.dataSource.config.recursive) {
      const pathElements = path.split("/").slice(0, -1);
      const projectPathElements = trimmedPath.split("/").filter((el) => el);

      return pathElements.join("/") === projectPathElements.join("/");
    }

    return true;
  }
}
