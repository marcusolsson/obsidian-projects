import { TFile, type App, type CachedMetadata } from "obsidian";
import type {
  ProjectDefinition,
  ProjectsPluginPreferences,
} from "src/settings/settings";

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
      return cache ? parseTags(cache).has(tag) : false;
    }

    return false;
  }
}

function parseTags(cache: CachedMetadata) {
  const allTags = new Set<string>();

  const markdownTags = cache.tags?.map((tag) => tag.tag) ?? [];

  markdownTags.forEach((tag) => allTags.add(tag));

  parseFrontMatterTags(cache.frontmatter?.["tags"]).forEach((tag) =>
    allTags.add(tag)
  );
  parseFrontMatterTags(cache.frontmatter?.["tag"]).forEach((tag) =>
    allTags.add(tag)
  );

  return allTags;
}

function parseFrontMatterTags(property: unknown): string[] {
  const res: string[] = [];

  if (typeof property === "string") {
    property
      .split(",")
      .map((tag) => "#" + tag.trim())
      .forEach((tag) => res.push(tag));
  } else if (Array.isArray(property)) {
    property.map((tag) => "#" + tag.toString()).forEach((tag) => res.push(tag));
  }

  return res;
}
