import { IFile, type IFileSystem } from "../filesystem";

class InMemFile extends IFile {
  constructor(
    private readonly _path: string,
    private _content: string,
    private fileSystem: InMemFileSystem
  ) {
    super();
  }

  get basename(): string {
    return this._path.split("/").at(-1) ?? this.path;
  }

  get path(): string {
    return this._path;
  }

  async read(): Promise<string> {
    return this._content;
  }

  async write(content: string): Promise<void> {
    this._content = content;
  }

  async delete(): Promise<void> {
    this.fileSystem.delete(this._path);
  }

  readTags(): Set<string> {
    throw new Error("Method not implemented.");
  }
}

export class InMemFileSystem implements IFileSystem {
  constructor(readonly files: Record<string, InMemFile>) {}

  async create(path: string, content: string): Promise<IFile> {
    if (this.files[path]) {
      throw new Error("File already exist");
    }

    const file = new InMemFile(path, content, this);

    this.files[path] = file;

    return file;
  }

  async delete(path: string): Promise<void> {
    delete this.files[path];
  }

  getAllFiles(): IFile[] {
    return Object.values(this.files);
  }

  getFile(path: string): IFile | null {
    return this.files[path] ?? null;
  }
}
