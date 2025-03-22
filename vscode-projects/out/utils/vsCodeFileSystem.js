"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSCodeFileSystem = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("util");
const gray_matter_1 = __importDefault(require("gray-matter"));
// Convert callback-based fs functions to promise-based
const readFile = (0, util_1.promisify)(fs.readFile);
const writeFile = (0, util_1.promisify)(fs.writeFile);
const unlink = (0, util_1.promisify)(fs.unlink);
const exists = (0, util_1.promisify)(fs.exists);
const readdir = (0, util_1.promisify)(fs.readdir);
const stat = (0, util_1.promisify)(fs.stat);
/**
 * VSCode implementation of the IFileSystem interface
 */
class VSCodeFileSystem {
    /**
     * Read a file's content
     */
    async readFile(filePath) {
        try {
            // Try to use VSCode API first since it works in remote workspaces
            try {
                const uri = vscode.Uri.file(filePath);
                const content = await vscode.workspace.fs.readFile(uri);
                return Buffer.from(content).toString('utf8');
            }
            catch (e) {
                // Fall back to fs API if VSCode API fails
                return (await readFile(filePath, 'utf8'));
            }
        }
        catch (error) {
            throw new Error(`Failed to read file ${filePath}: ${error}`);
        }
    }
    /**
     * Write content to a file
     */
    async writeFile(filePath, content) {
        try {
            // Ensure the directory exists
            await this.ensureDirectory(path.dirname(filePath));
            // Try to use VSCode API first
            try {
                const uri = vscode.Uri.file(filePath);
                const bytes = Buffer.from(content, 'utf8');
                await vscode.workspace.fs.writeFile(uri, bytes);
            }
            catch (e) {
                // Fall back to fs API
                await writeFile(filePath, content, 'utf8');
            }
        }
        catch (error) {
            throw new Error(`Failed to write to file ${filePath}: ${error}`);
        }
    }
    /**
     * Delete a file
     */
    async deleteFile(filePath) {
        try {
            // Try VSCode API first
            try {
                const uri = vscode.Uri.file(filePath);
                await vscode.workspace.fs.delete(uri);
            }
            catch (e) {
                // Fall back to fs API
                await unlink(filePath);
            }
        }
        catch (error) {
            throw new Error(`Failed to delete file ${filePath}: ${error}`);
        }
    }
    /**
     * Check if a file exists
     */
    async fileExists(filePath) {
        try {
            // Try VSCode API first
            try {
                const uri = vscode.Uri.file(filePath);
                await vscode.workspace.fs.stat(uri);
                return true;
            }
            catch (e) {
                // VSCode API threw an error, file might not exist
                return exists(filePath);
            }
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Get all files in a folder, optionally recursively
     */
    async getFilesInFolder(folderPath, recursive) {
        const files = [];
        try {
            const entries = await readdir(folderPath);
            for (const entry of entries) {
                const fullPath = path.join(folderPath, entry);
                const stats = await stat(fullPath);
                if (stats.isFile()) {
                    files.push(fullPath);
                }
                else if (stats.isDirectory() && recursive) {
                    const subFiles = await this.getFilesInFolder(fullPath, recursive);
                    files.push(...subFiles);
                }
            }
        }
        catch (error) {
            console.error(`Error reading directory ${folderPath}:`, error);
        }
        return files;
    }
    /**
     * Parse frontmatter from content
     */
    parseFrontMatter(content) {
        try {
            const { data } = (0, gray_matter_1.default)(content);
            return data;
        }
        catch (error) {
            console.error('Error parsing frontmatter:', error);
            return {};
        }
    }
    /**
     * Add frontmatter to content
     */
    addFrontMatter(content, frontmatter) {
        try {
            // If content already has frontmatter, extract it
            let { content: bodyContent, data: existingData } = (0, gray_matter_1.default)(content);
            // Merge existing and new frontmatter
            const mergedData = { ...existingData, ...frontmatter };
            // Create new content with merged frontmatter
            return gray_matter_1.default.stringify(bodyContent, mergedData);
        }
        catch (error) {
            console.error('Error adding frontmatter:', error);
            return content;
        }
    }
    /**
     * Ensure a directory exists, creating it if necessary
     */
    async ensureDirectory(dirPath) {
        try {
            await vscode.workspace.fs.createDirectory(vscode.Uri.file(dirPath));
        }
        catch (error) {
            // If VSCode API fails, use fs.mkdir recursively
            try {
                await (0, util_1.promisify)(fs.mkdir)(dirPath, { recursive: true });
            }
            catch (error) {
                // If directory already exists, this is fine
                const mkdirError = error;
                if (mkdirError.code !== 'EEXIST') {
                    throw error;
                }
            }
        }
    }
}
exports.VSCodeFileSystem = VSCodeFileSystem;
//# sourceMappingURL=vsCodeFileSystem.js.map