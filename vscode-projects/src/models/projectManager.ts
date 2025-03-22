import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';
import { ProjectDefinition, ViewDefinition, ProjectsExtensionSettings, DEFAULT_PROJECT, DEFAULT_VIEW, DEFAULT_SETTINGS } from './settings';
import { IFileSystem } from '../utils/fileSystem';
import { DataRecord, DataFrame, RecordError } from './dataframe';
import * as path from 'path';

/**
 * ProjectManager handles all project operations and maintains settings
 */
export class ProjectManager {
  private settings: ProjectsExtensionSettings;

  constructor(
    private context: vscode.ExtensionContext,
    private fileSystem: IFileSystem
  ) {
    this.settings = this.loadSettings();
  }

  /**
   * Get all projects
   */
  public getProjects(): ProjectDefinition[] {
    return this.settings.projects;
  }

  /**
   * Get archived projects
   */
  public getArchives(): ProjectDefinition[] {
    return this.settings.archives;
  }

  /**
   * Get a project by ID
   */
  public getProject(id: string): ProjectDefinition | undefined {
    return this.settings.projects.find(project => project.id === id);
  }

  /**
   * Create a new project
   */
  public async createProject(name: string, folderUri?: vscode.Uri): Promise<ProjectDefinition> {
    const id = uuidv4();
    
    let project: ProjectDefinition = {
      ...DEFAULT_PROJECT,
      id,
      name,
      views: [
        {
          ...DEFAULT_VIEW,
          id: uuidv4(),
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
   * Add a new view to a project
   */
  public async addViewToProject(
    projectId: string, 
    viewName: string, 
    viewType: string, 
    config: Record<string, any> = {}
  ): Promise<void> {
    // Find the project
    const project = this.getProject(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    // Create a new view with a unique ID
    const newView: ViewDefinition = {
      id: uuidv4(),
      name: viewName,
      type: viewType,
      config: config,
      filter: { conjunction: 'and', conditions: [] },
      colors: { conditions: [] },
      sort: { criteria: [] }
    };
    
    // Create a new project object with the updated views array
    const updatedProject = {
      ...project,
      views: [...project.views, newView]
    };
    
    // Update the project
    await this.updateProject(updatedProject);
    
    return;
  }
  
  /**
   * Update a project
   */
  public async updateProject(project: ProjectDefinition): Promise<void> {
    // Create a new array with the updated project
    const updatedProjects = this.settings.projects.map(p => 
      p.id === project.id ? project : p
    );
    
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
  public async deleteProject(id: string): Promise<void> {
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
  public async archiveProject(id: string): Promise<void> {
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
  public async createNote(project: ProjectDefinition, name: string, templatePath?: string): Promise<string> {
    // Determine the target folder
    let targetFolder = '';
    
    if (project.newFilesFolder) {
      targetFolder = project.newFilesFolder;
    } else if (project.dataSource.kind === 'folder') {
      targetFolder = project.dataSource.config.path;
    } else {
      // For other datasource types, use the workspace root or ask the user
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (workspaceFolders && workspaceFolders.length > 0) {
        targetFolder = workspaceFolders[0]?.uri.fsPath || '';
      } else {
        const folderUri = await vscode.window.showOpenDialog({
          canSelectFiles: false,
          canSelectFolders: true,
          canSelectMany: false,
          title: 'Select a folder to save the new note'
        });
        
        if (folderUri && folderUri.length > 0) {
          targetFolder = folderUri[0]?.fsPath || '';
        } else {
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
      } catch (error) {
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
  public async queryProject(project: ProjectDefinition): Promise<DataFrame> {
    const records: DataRecord[] = [];
    const errors: RecordError[] = [];

    try {
      if (project.dataSource.kind === 'folder') {
        const files = await this.fileSystem.getFilesInFolder(
          project.dataSource.config.path, 
          project.dataSource.config.recursive
        );
        
        for (const file of files) {
          try {
            if (file.endsWith('.md')) {
              const id = file;
              const content = await this.fileSystem.readFile(file);
              const frontmatter = this.fileSystem.parseFrontMatter(content);
              
              // Create a new record
              const record: DataRecord = {
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
          } catch (err) {
            // Convert Error to RecordError
            errors.push(new RecordError(
              file,
              err instanceof Error ? err : new Error(`${err}`)
            ));
          }
        }
      } else if (project.dataSource.kind === 'tag') {
        // Tag-based datasource implementation would go here
        // Would need to scan all files and filter by tag
      } else if (project.dataSource.kind === 'query') {
        // Query-based datasource implementation would go here
        // Would need to implement a query engine
      }
    } catch (err) {
      // Convert Error to RecordError
      errors.push(new RecordError(
        'project',
        err instanceof Error ? err : new Error(`Error querying project: ${err}`)
      ));
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
  private loadSettings(): ProjectsExtensionSettings {
    const config = vscode.workspace.getConfiguration('vscode-projects');
    
    // Load individual sections
    const projects = config.get<ProjectDefinition[]>('projects', []);
    const archives = config.get<ProjectDefinition[]>('archives', []);
    const preferences = config.get('preferences', DEFAULT_SETTINGS.preferences);
    
    return {
      projects,
      archives,
      preferences
    };
  }

  /**
   * Save settings to configuration
   */
  private async saveSettings(): Promise<void> {
    const config = vscode.workspace.getConfiguration('vscode-projects');
    
    await config.update('projects', this.settings.projects, vscode.ConfigurationTarget.Global);
    await config.update('archives', this.settings.archives, vscode.ConfigurationTarget.Global);
    await config.update('preferences', this.settings.preferences, vscode.ConfigurationTarget.Global);
  }

  /**
   * Simple field detection from records
   * (This would be more sophisticated in a real implementation)
   */
  private detectFields(records: DataRecord[]) {
    const fieldMap = new Map<string, { type: string, repeated: boolean }>();
    
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
      type: type as any,
      repeated,
      identifier: name === 'id',
      derived: name === 'path' || name === 'name'
    }));
  }

  /**
   * Determine the type of a value
   */
  private determineType(value: any): string {
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
