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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
const vscode = __importStar(require("vscode"));
const uuid_1 = require("uuid");
const settings_1 = require("./settings");
const dataframe_1 = require("./dataframe");
const path = __importStar(require("path"));
/**
 * ProjectManager handles all project operations and maintains settings
 */
class ProjectManager {
    constructor(context, fileSystem) {
        this.context = context;
        this.fileSystem = fileSystem;
        this.settings = this.loadSettings();
    }
    /**
     * Get all projects
     */
    getProjects() {
        return this.settings.projects;
    }
    /**
     * Get archived projects
     */
    getArchives() {
        return this.settings.archives;
    }
    /**
     * Get a project by ID
     */
    getProject(id) {
        return this.settings.projects.find(project => project.id === id);
    }
    /**
     * Create a new project
     */
    async createProject(name, folderUri) {
        const id = (0, uuid_1.v4)();
        let project = {
            ...settings_1.DEFAULT_PROJECT,
            id,
            name,
            views: [
                {
                    ...settings_1.DEFAULT_VIEW,
                    id: (0, uuid_1.v4)(),
                    name: 'Table',
                    type: 'table'
                }
            ]
        };
        // If a folder was selected, make it a folder-based project
        if (folderUri) {
            // Create a new project object with the updated dataSource
            project = {
                ...project,
                dataSource: {
                    kind: 'folder',
                    config: {
                        path: folderUri.fsPath,
                        recursive: false
                    }
                }
            };
        }
        // Use a new array to avoid modifying read-only properties
        const updatedProjects = [...this.settings.projects, project];
        // Create a new settings object with the updated projects array
        this.settings = {
            ...this.settings,
            projects: updatedProjects
        };
        await this.saveSettings();
        return project;
    }
    /**
     * Update a project
     */
    async updateProject(project) {
        // Create a new array with the updated project
        const updatedProjects = this.settings.projects.map(p => p.id === project.id ? project : p);
        // Update settings with the new array
        this.settings = {
            ...this.settings,
            projects: updatedProjects
        };
        await this.saveSettings();
    }
    /**
     * Delete a project
     */
    async deleteProject(id) {
        // Create a new array without the deleted project
        const updatedProjects = this.settings.projects.filter(p => p.id !== id);
        // Update settings with the new array
        this.settings = {
            ...this.settings,
            projects: updatedProjects
        };
        await this.saveSettings();
    }
    /**
     * Archive a project
     */
    async archiveProject(id) {
        const project = this.settings.projects.find(p => p.id === id);
        if (project) {
            // Create new arrays for projects and archives
            const updatedProjects = this.settings.projects.filter(p => p.id !== id);
            const updatedArchives = [...this.settings.archives, project];
            // Update settings with the new arrays
            this.settings = {
                ...this.settings,
                projects: updatedProjects,
                archives: updatedArchives
            };
            await this.saveSettings();
        }
    }
    /**
     * Create a new note/file for a project
     */
    async createNote(project, name, templatePath) {
        // Determine the target folder
        let targetFolder = '';
        if (project.newFilesFolder) {
            targetFolder = project.newFilesFolder;
        }
        else if (project.dataSource.kind === 'folder') {
            targetFolder = project.dataSource.config.path;
        }
        else {
            // For other datasource types, use the workspace root or ask the user
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders && workspaceFolders.length > 0) {
                targetFolder = workspaceFolders[0]?.uri.fsPath || '';
            }
            else {
                const folderUri = await vscode.window.showOpenDialog({
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false,
                    title: 'Select a folder to save the new note'
                });
                if (folderUri && folderUri.length > 0) {
                    targetFolder = folderUri[0]?.fsPath || '';
                }
                else {
                    throw new Error('No folder selected');
                }
            }
        }
        // Generate file path
        const filePath = path.join(targetFolder, `${name}.md`);
        // Create content (with frontmatter)
        let content = '';
        // Use template if provided
        if (templatePath) {
            try {
                content = await this.fileSystem.readFile(templatePath);
                // Basic template variable replacement could be implemented here
            }
            catch (error) {
                console.error('Error reading template file:', error);
            }
        }
        // Create the new file
        await this.fileSystem.writeFile(filePath, content);
        return filePath;
    }
    /**
     * Query data for a project
     */
    async queryProject(project) {
        const records = [];
        const errors = [];
        try {
            if (project.dataSource.kind === 'folder') {
                const files = await this.fileSystem.getFilesInFolder(project.dataSource.config.path, project.dataSource.config.recursive);
                for (const file of files) {
                    try {
                        if (file.endsWith('.md')) {
                            const id = file;
                            const content = await this.fileSystem.readFile(file);
                            const frontmatter = this.fileSystem.parseFrontMatter(content);
                            // Create a new record
                            const record = {
                                id,
                                values: {
                                    ...frontmatter,
                                    path: file,
                                    name: path.basename(file, '.md')
                                }
                            };
                            // Skip excluded files
                            if (!project.excludedFiles.includes(file)) {
                                records.push(record);
                            }
                        }
                    }
                    catch (err) {
                        // Convert Error to RecordError
                        errors.push(new dataframe_1.RecordError(file, err instanceof Error ? err : new Error(`${err}`)));
                    }
                }
            }
            else if (project.dataSource.kind === 'tag') {
                // Tag-based datasource implementation would go here
                // Would need to scan all files and filter by tag
            }
            else if (project.dataSource.kind === 'query') {
                // Query-based datasource implementation would go here
                // Would need to implement a query engine
            }
        }
        catch (err) {
            // Convert Error to RecordError
            errors.push(new dataframe_1.RecordError('project', err instanceof Error ? err : new Error(`Error querying project: ${err}`)));
        }
        // This is a simplified version - field detection would be more complex
        const fields = this.detectFields(records);
        return {
            records,
            fields,
            errors
        };
    }
    /**
     * Load settings from configuration
     */
    loadSettings() {
        const config = vscode.workspace.getConfiguration('vscode-projects');
        // Load individual sections
        const projects = config.get('projects', []);
        const archives = config.get('archives', []);
        const preferences = config.get('preferences', settings_1.DEFAULT_SETTINGS.preferences);
        return {
            projects,
            archives,
            preferences
        };
    }
    /**
     * Save settings to configuration
     */
    async saveSettings() {
        const config = vscode.workspace.getConfiguration('vscode-projects');
        await config.update('projects', this.settings.projects, vscode.ConfigurationTarget.Global);
        await config.update('archives', this.settings.archives, vscode.ConfigurationTarget.Global);
        await config.update('preferences', this.settings.preferences, vscode.ConfigurationTarget.Global);
    }
    /**
     * Simple field detection from records
     * (This would be more sophisticated in a real implementation)
     */
    detectFields(records) {
        const fieldMap = new Map();
        // Collect all keys and determine their types
        for (const record of records) {
            for (const [key, value] of Object.entries(record.values)) {
                if (!fieldMap.has(key)) {
                    const type = this.determineType(value);
                    const repeated = Array.isArray(value);
                    fieldMap.set(key, { type, repeated });
                }
            }
        }
        return Array.from(fieldMap.entries()).map(([name, { type, repeated }]) => ({
            name,
            type: type,
            repeated,
            identifier: name === 'id',
            derived: name === 'path' || name === 'name'
        }));
    }
    /**
     * Determine the type of a value
     */
    determineType(value) {
        if (value === null || value === undefined) {
            return 'unknown';
        }
        if (Array.isArray(value)) {
            if (value.length > 0) {
                return this.determineType(value[0]);
            }
            return 'string';
        }
        if (value instanceof Date) {
            return 'date';
        }
        return typeof value;
    }
}
exports.ProjectManager = ProjectManager;
//# sourceMappingURL=projectManager.js.map