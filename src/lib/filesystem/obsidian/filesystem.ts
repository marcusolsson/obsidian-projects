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

    if (file instanceof TFile && file.extension === "md") {
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

  getFile(path: string): IFile | null {
    if (this.app.vault.getAbstractFileByPath(path)) {
      return ObsidianFile.of(path, this.app);
    }
    return null;
  }

  getAllFiles(): IFile[] {
    return this.app.vault
      .getMarkdownFiles()
      .map((file) => new ObsidianFile(file, this.app));
  }
}

// ObsidianFileSystemWatcher is the primary file system watcher. This exists
// mostly for testability, since the obsidian package is difficult to use in
// unit tests.
export class ObsidianFileSystemWatcher implements IFileSystemWatcher {
  constructor(readonly plugin: Plugin) {}

  // onCreate registers an event handler that runs when a file has been created.
  onCreate(callback: (file: IFile) => Promise<void>): void {
    this.plugin.registerEvent(
      this.plugin.app.vault.on("create", (file) => {
        if (file instanceof TFile && file.extension === "md") {
          callback(new ObsidianFile(file, this.plugin.app));
        }
      })
    );
  }

  // onChange registers an event handler that runs when a file has been modified.
  onChange(callback: (file: IFile) => Promise<void>): void {
    this.plugin.registerEvent(
      this.plugin.app.metadataCache.on("changed", (file) => {
        if (file instanceof TFile && file.extension === "md") {
          callback(new ObsidianFile(file, this.plugin.app));
        }
      })
    );
  }

  // onDelete registers an event handler that runs when a file has been deleted.
  onDelete(callback: (file: IFile) => Promise<void>): void {
    this.plugin.registerEvent(
      this.plugin.app.vault.on("delete", (file) => {
        if (file instanceof TFile && file.extension === "md") {
          callback(new ObsidianFile(file, this.plugin.app));
        }
      })
    );
  }

  // onRename registers an event handler that runs when a file has been renamed.
  onRename(callback: (file: IFile, oldPath: string) => Promise<void>): void {
    this.plugin.registerEvent(
      this.plugin.app.vault.on("rename", (file, oldPath) => {
        if (file instanceof TFile && file.extension === "md") {
          callback(new ObsidianFile(file, this.plugin.app), oldPath);
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
