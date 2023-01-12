import { TFile, type App } from "obsidian";

import type { ProjectDefinition } from "src/types";

import type { ProjectsPluginPreferences } from "src/main";
import { FrontMatterDataSource } from "../frontmatter/frontmatter";

export class TagDataSource extends FrontMatterDataSource {
  constructor(
    readonly app: App,
    project: ProjectDefinition,
    preferences: ProjectsPluginPreferences
  ) {
    super(app, project, preferences);
  }

  includes(path: string): boolean {
    if (this.project.dataSource.kind !== "tag") {
      return false;
    }

    if (this.project.excludedNotes?.includes(path)) {
      return false;
    }

    const { tag } = this.project.dataSource.config;

    const file = this.app.vault.getAbstractFileByPath(path);

    if (file instanceof TFile) {
      const cache = this.app.metadataCache.getFileCache(file);

      return cache?.tags?.map((tag) => tag.tag).includes(tag) ?? false;
    }

    return false;
  }
}
