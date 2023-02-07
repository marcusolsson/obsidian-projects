import type { IFileSystem } from "src/lib/filesystem/filesystem";
import type {
  ProjectDefinition,
  ProjectsPluginPreferences,
} from "src/settings/settings";

import { FrontMatterDataSource } from "../frontmatter/frontmatter";

export class TagDataSource extends FrontMatterDataSource {
  constructor(
    readonly fileSystem: IFileSystem,
    project: ProjectDefinition,
    preferences: ProjectsPluginPreferences
  ) {
    super(fileSystem, project, preferences);
  }

  includes(path: string): boolean {
    if (this.project.dataSource.kind !== "tag") {
      return false;
    }

    if (this.project.excludedNotes?.includes(path)) {
      return false;
    }

    const { tag } = this.project.dataSource.config;

    const file = this.fileSystem.getFile(path);

    if (file) {
      return file.readTags().has(tag);
    }

    return false;
  }
}
