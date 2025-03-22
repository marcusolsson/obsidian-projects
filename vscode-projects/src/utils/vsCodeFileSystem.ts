import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { IFileSystem } from './fileSystem';
import matter from 'gray-matter';

// Convert callback-based fs functions to promise-based
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

/**
 * VSCode implementation of the IFileSystem interface
 */
export class VSCodeFileSystem implements IFileSystem {
  /**
   * Read a file's content
   */
  async readFile(filePath: string): Promise<string> {
    try {
      // Try to use VSCode API first since it works in remote workspaces
      try {
        const uri = vscode.Uri.file(filePath);
        const content = await vscode.workspace.fs.readFile(uri);
        return Buffer.from(content).toString('utf8');
      } catch (e) {
        // Fall back to fs API if VSCode API fails
        return (await readFile(filePath, 'utf8'));
      }
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
  }

  /**
   * Write content to a file
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      // Ensure the directory exists
      await this.ensureDirectory(path.dirname(filePath));
      
      // Try to use VSCode API first
      try {
        const uri = vscode.Uri.file(filePath);
        const bytes = Buffer.from(content, 'utf8');
        await vscode.workspace.fs.writeFile(uri, bytes);
      } catch (e) {
        // Fall back to fs API
        await writeFile(filePath, content, 'utf8');
      }
    } catch (error) {
      throw new Error(`Failed to write to file ${filePath}: ${error}`);
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      // Try VSCode API first
      try {
        const uri = vscode.Uri.file(filePath);
        await vscode.workspace.fs.delete(uri);
      } catch (e) {
        // Fall back to fs API
        await unlink(filePath);
      }
    } catch (error) {
      throw new Error(`Failed to delete file ${filePath}: ${error}`);
    }
  }

  /**
   * Check if a file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      // Try VSCode API first
      try {
        const uri = vscode.Uri.file(filePath);
        await vscode.workspace.fs.stat(uri);
        return true;
      } catch (e) {
        // VSCode API threw an error, file might not exist
        return exists(filePath);
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all files in a folder, optionally recursively
   */
  async getFilesInFolder(folderPath: string, recursive: boolean): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await readdir(folderPath);
      
      for (const entry of entries) {
        const fullPath = path.join(folderPath, entry);
        const stats = await stat(fullPath);
        
        if (stats.isFile()) {
          files.push(fullPath);
        } else if (stats.isDirectory() && recursive) {
          const subFiles = await this.getFilesInFolder(fullPath, recursive);
          files.push(...subFiles);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${folderPath}:`, error);
    }
    
    return files;
  }

  /**
   * Parse frontmatter from content
   */
  parseFrontMatter(content: string): Record<string, any> {
    try {
      const { data } = matter(content);
      return data;
    } catch (error) {
      console.error('Error parsing frontmatter:', error);
      return {};
    }
  }

  /**
   * Add frontmatter to content
   */
  addFrontMatter(content: string, frontmatter: Record<string, any>): string {
    try {
      // If content already has frontmatter, extract it
      let { content: bodyContent, data: existingData } = matter(content);
      
      // Merge existing and new frontmatter
      const mergedData = { ...existingData, ...frontmatter };
      
      // Create new content with merged frontmatter
      return matter.stringify(bodyContent, mergedData);
    } catch (error) {
      console.error('Error adding frontmatter:', error);
      return content;
    }
  }

  /**
   * Ensure a directory exists, creating it if necessary
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await vscode.workspace.fs.createDirectory(vscode.Uri.file(dirPath));
    } catch (error) {
      // If VSCode API fails, use fs.mkdir recursively
      try {
        await promisify(fs.mkdir)(dirPath, { recursive: true });
      } catch (error) {
        // If directory already exists, this is fine
        const mkdirError = error as { code?: string };
        if (mkdirError.code !== 'EEXIST') {
          throw error;
        }
      }
    }
  }
}
