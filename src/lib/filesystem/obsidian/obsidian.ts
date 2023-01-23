import {
  App,
  normalizePath,
  Plugin,
  TFile,
  type CachedMetadata,
} from "obsidian";
import { notEmpty } from "src/lib/helpers";
import {
  IFile,
  type IFileSystem,
  type IFileSystemWatcher,
} from "../filesystem";

class ObsidianFile extends IFile {
  static of(path: string, app: App): IFile {
    const file = app.vault.getAbstractFileByPath(normalizePath(path));

    if (file instanceof TFile) {
      return new ObsidianFile(file, app);
    }

    throw new Error("Not a file");
  }

  constructor(readonly file: TFile, readonly app: App) {
    super();
  }

  get basename(): string {
    return this.file.basename;
  }
  get path(): string {
    return this.file.path;
  }

  read(): Promise<string> {
    return this.app.vault.read(this.file);
  }

  write(content: string): Promise<void> {
    return this.app.vault.modify(this.file, content);
  }

  delete(): Promise<void> {
    return this.app.vault.trash(this.file, true);
  }

  readTags(): Set<string> {
    const cache = this.app.metadataCache.getFileCache(this.file);

    if (cache) {
      return parseTags(cache);
    }

    return new Set<string>();
  }
}

export class ObsidianFileSystem implements IFileSystem {
  constructor(readonly app: App) {}

  async create(path: string, content: string): Promise<IFile> {
    const file = await this.app.vault.create(normalizePath(path), content);

    return new ObsidianFile(file, this.app);
  }

  async read(path: string): Promise<string> {
    const file = this.app.vault.getAbstractFileByPath(normalizePath(path));
    if (file instanceof TFile) {
      return this.app.vault.cachedRead(file);
    }
    return "";
  }

  async write(path: string, content: string): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(normalizePath(path));
    if (file instanceof TFile) {
      return this.app.vault.modify(file, content);
    }
  }

  async delete(path: string): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(normalizePath(path));
    if (file instanceof TFile) {
      return this.app.vault.trash(file, true);
    }
  }

  getFile(path: string): IFile {
    return ObsidianFile.of(path, this.app);
  }

  getAllFiles(): IFile[] {
    return this.app.vault
      .getMarkdownFiles()
      .map((file) => new ObsidianFile(file, this.app));
  }
}

export class ObsidianFileSystemWatcher implements IFileSystemWatcher {
  constructor(readonly plugin: Plugin) {}

  onCreate(callback: (file: IFile) => Promise<void>): void {
    this.plugin.registerEvent(
      this.plugin.app.vault.on("create", (file) => {
        if (file instanceof TFile) {
          callback(new ObsidianFile(file, app));
        }
      })
    );
  }

  onChange(callback: (file: IFile) => Promise<void>): void {
    this.plugin.registerEvent(
      this.plugin.app.metadataCache.on("changed", (file) => {
        if (file instanceof TFile) {
          callback(new ObsidianFile(file, app));
        }
      })
    );
  }

  onDelete(callback: (file: IFile) => Promise<void>): void {
    this.plugin.registerEvent(
      this.plugin.app.vault.on("delete", (file) => {
        if (file instanceof TFile) {
          callback(new ObsidianFile(file, app));
        }
      })
    );
  }

  onRename(callback: (file: IFile, oldPath: string) => Promise<void>): void {
    this.plugin.registerEvent(
      this.plugin.app.vault.on("rename", (file, oldPath) => {
        if (file instanceof TFile) {
          callback(new ObsidianFile(file, app), oldPath);
        }
      })
    );
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
    property
      .filter(notEmpty)
      .map((tag) => "#" + tag.toString())
      .forEach((tag) => res.push(tag));
  }

  return res;
}
