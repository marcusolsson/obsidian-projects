/**
 * Interface for filesystem operations
 * This abstracts file operations to make testing easier and
 * provide a consistent API regardless of platform
 */
export interface IFileSystem {
  /**
   * Read file content
   */
  readFile(path: string): Promise<string>;
  
  /**
   * Write content to a file
   */
  writeFile(path: string, content: string): Promise<void>;
  
  /**
   * Delete a file
   */
  deleteFile(path: string): Promise<void>;
  
  /**
   * Check if a file exists
   */
  fileExists(path: string): Promise<boolean>;
  
  /**
   * Get all files in a folder, optionally recursively
   */
  getFilesInFolder(folderPath: string, recursive: boolean): Promise<string[]>;
  
  /**
   * Parse frontmatter from content
   */
  parseFrontMatter(content: string): Record<string, any>;
  
  /**
   * Add frontmatter to content
   */
  addFrontMatter(content: string, frontmatter: Record<string, any>): string;
}
