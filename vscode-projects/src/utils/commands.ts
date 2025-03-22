import * as vscode from 'vscode';
import { ProjectManager } from '../models/projectManager';
import { ProjectsProvider } from '../providers/projectsProvider';

/**
 * Creates a new project
 */
export async function createProject(
  projectManager: ProjectManager,
  projectsProvider: ProjectsProvider
): Promise<void> {
  // Ask for project name
  const projectName = await vscode.window.showInputBox({
    prompt: 'Enter a name for the new project',
    placeHolder: 'My Project'
  });
  
  if (!projectName) {
    return;
  }
  
  // Ask if this should be folder-based
  const options = [
    { label: 'Folder-based project', description: 'Create a project based on a specific folder' },
    { label: 'Tag-based project', description: 'Create a project based on file tags' },
    { label: 'Query-based project', description: 'Create a project based on a search query' }
  ];
  
  const selectedOption = await vscode.window.showQuickPick(options, {
    placeHolder: 'Select the type of project'
  });
  
  if (!selectedOption) {
    return;
  }
  
  try {
    let projectUri: vscode.Uri | undefined;
    
    // If folder-based, ask for folder
    if (selectedOption.label === 'Folder-based project') {
      const folders = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        title: 'Select a folder for the project'
      });
      
      if (folders && folders.length > 0) {
        projectUri = folders[0];
      } else {
        return;
      }
    }
    
    // Create the project
    await projectManager.createProject(projectName, projectUri);
    
    // Refresh the tree view
    projectsProvider.refresh();
    
    vscode.window.showInformationMessage(`Project "${projectName}" created successfully.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create project: ${error}`);
  }
}

/**
 * Creates a new note for a project
 */
export async function createNote(projectManager: ProjectManager): Promise<void> {
  // Get available projects
  const projects = projectManager.getProjects();
  
  if (projects.length === 0) {
    vscode.window.showErrorMessage('No projects exist. Create a project first.');
    return;
  }
  
  // Let user select a project
  const projectItems = projects.map(project => ({
    label: project.name,
    description: getDataSourceDescription(project),
    project
  }));
  
  const selectedProjectItem = await vscode.window.showQuickPick(projectItems, {
    placeHolder: 'Select a project to create a note in'
  });
  
  if (!selectedProjectItem) {
    return;
  }
  
  // Ask for note name
  const noteName = await vscode.window.showInputBox({
    prompt: 'Enter a name for the new note',
    placeHolder: 'My Note'
  });
  
  if (!noteName) {
    return;
  }
  
  try {
    // Check if project has templates
    let templatePath: string | undefined;
    
    if (selectedProjectItem.project.templates && selectedProjectItem.project.templates.length > 0) {
      const templateItems = selectedProjectItem.project.templates.map(template => ({
        label: template.replace(/^.*[\\\/]/, ''), // Get filename only
        description: template,
        template
      }));
      
      templateItems.unshift({
        label: 'No template',
        description: 'Create a blank note',
        template: ''
      });
      
      const selectedTemplate = await vscode.window.showQuickPick(templateItems, {
        placeHolder: 'Select a template (optional)'
      });
      
      if (selectedTemplate && selectedTemplate.template) {
        templatePath = selectedTemplate.template;
      }
    }
    
    // Create the note
    const filePath = await projectManager.createNote(
      selectedProjectItem.project,
      noteName,
      templatePath
    );
    
    // Open the created file
    const uri = vscode.Uri.file(filePath);
    await vscode.window.showTextDocument(uri);
    
    vscode.window.showInformationMessage(`Note "${noteName}" created successfully.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create note: ${error}`);
  }
}

/**
 * Creates a new view for a project
 */
export async function createView(projectManager: ProjectManager): Promise<void> {
  // Get available projects
  const projects = projectManager.getProjects();
  
  if (projects.length === 0) {
    vscode.window.showErrorMessage('No projects exist. Create a project first.');
    return;
  }
  
  // Let user select a project
  const projectItems = projects.map(project => ({
    label: project.name,
    description: getDataSourceDescription(project),
    project
  }));
  
  const selectedProjectItem = await vscode.window.showQuickPick(projectItems, {
    placeHolder: 'Select a project to add a view to'
  });
  
  if (!selectedProjectItem) {
    return;
  }
  
  // Ask for view name
  const viewName = await vscode.window.showInputBox({
    prompt: 'Enter a name for the new view',
    placeHolder: 'New View'
  });
  
  if (!viewName) {
    return;
  }
  
  // Ask for view type
  const viewTypeOptions = [
    { label: 'Table', description: 'Display items in a table layout' },
    { label: 'Board', description: 'Display items in a kanban board layout' },
    { label: 'Calendar', description: 'Display items in a calendar' },
    { label: 'Gallery', description: 'Display items in a gallery grid' }
  ];
  
  const selectedViewType = await vscode.window.showQuickPick(viewTypeOptions, {
    placeHolder: 'Select the type of view'
  });
  
  if (!selectedViewType) {
    return;
  }
  
  try {
    // Create the view
    const viewType = selectedViewType.label.toLowerCase();
    
    // For board view, ask for a field to group by
    let groupByField: string | undefined;
    
    if (viewType === 'board') {
      const dataframe = await projectManager.queryProject(selectedProjectItem.project);
      if (dataframe.fields.length > 0) {
        const fieldOptions = dataframe.fields.map(field => ({
          label: field.name,
          description: `Type: ${field.type}`
        }));
        
        const selectedField = await vscode.window.showQuickPick(fieldOptions, {
          placeHolder: 'Select a field to group by in the board view'
        });
        
        if (selectedField) {
          groupByField = selectedField.label;
        }
      }
    }
    
    // Add the view to the project
    await projectManager.addViewToProject(
      selectedProjectItem.project.id,
      viewName,
      viewType,
      groupByField ? { groupByField } : {}
    );
    
    vscode.window.showInformationMessage(`View "${viewName}" created successfully.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create view: ${error}`);
  }
}

/**
 * Deletes a project
 */
export async function deleteProject(
  projectManager: ProjectManager,
  projectsProvider: ProjectsProvider
): Promise<void> {
  // Get available projects
  const projects = projectManager.getProjects();
  
  if (projects.length === 0) {
    vscode.window.showErrorMessage('No projects exist to delete.');
    return;
  }
  
  // Let user select a project
  const projectItems = projects.map(project => ({
    label: project.name,
    description: getDataSourceDescription(project),
    id: project.id
  }));
  
  const selectedProject = await vscode.window.showQuickPick(projectItems, {
    placeHolder: 'Select a project to delete'
  });
  
  if (!selectedProject) {
    return;
  }
  
  // Ask for confirmation
  const confirmed = await vscode.window.showWarningMessage(
    `Are you sure you want to delete the project "${selectedProject.label}"? This action cannot be undone.`,
    { modal: true },
    'Delete'
  );
  
  if (confirmed !== 'Delete') {
    return;
  }
  
  try {
    // Delete the project
    await projectManager.deleteProject(selectedProject.id);
    
    // Refresh the tree view
    projectsProvider.refresh();
    
    vscode.window.showInformationMessage(`Project "${selectedProject.label}" deleted successfully.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to delete project: ${error}`);
  }
}

/**
 * Deletes a view from a project
 */
export async function deleteView(
  projectManager: ProjectManager,
  projectsProvider: ProjectsProvider
): Promise<void> {
  // Get available projects
  const projects = projectManager.getProjects();
  
  if (projects.length === 0) {
    vscode.window.showErrorMessage('No projects exist.');
    return;
  }
  
  // Let user select a project
  const projectItems = projects.map(project => ({
    label: project.name,
    description: getDataSourceDescription(project),
    project
  }));
  
  const selectedProjectItem = await vscode.window.showQuickPick(projectItems, {
    placeHolder: 'Select a project'
  });
  
  if (!selectedProjectItem) {
    return;
  }
  
  // Get views for the selected project
  const views = selectedProjectItem.project.views;
  
  if (views.length === 0) {
    vscode.window.showErrorMessage(`Project "${selectedProjectItem.label}" has no views.`);
    return;
  }
  
  if (views.length === 1) {
    vscode.window.showErrorMessage(`Cannot delete the only view in a project. A project must have at least one view.`);
    return;
  }
  
  // Let user select a view
  const viewItems = views.map(view => ({
    label: view.name,
    description: `Type: ${view.type}`,
    id: view.id
  }));
  
  const selectedView = await vscode.window.showQuickPick(viewItems, {
    placeHolder: 'Select a view to delete'
  });
  
  if (!selectedView) {
    return;
  }
  
  // Ask for confirmation
  const confirmed = await vscode.window.showWarningMessage(
    `Are you sure you want to delete the view "${selectedView.label}" from project "${selectedProjectItem.label}"? This action cannot be undone.`,
    { modal: true },
    'Delete'
  );
  
  if (confirmed !== 'Delete') {
    return;
  }
  
  try {
    // Create an updated project without the deleted view
    const updatedProject = {
      ...selectedProjectItem.project,
      views: selectedProjectItem.project.views.filter(v => v.id !== selectedView.id)
    };
    
    // Update the project
    await projectManager.updateProject(updatedProject);
    
    // Refresh the tree view
    projectsProvider.refresh();
    
    vscode.window.showInformationMessage(`View "${selectedView.label}" deleted successfully.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to delete view: ${error}`);
  }
}

/**
 * Helper function to get a description for a data source
 */
function getDataSourceDescription(project: any): string {
  const dataSource = project.dataSource;
  
  if (dataSource.kind === 'folder') {
    return `Folder: ${dataSource.config.path}`;
  } else if (dataSource.kind === 'tag') {
    return `Tag: ${dataSource.config.tag}`;
  } else if (dataSource.kind === 'query') {
    return `Query: ${dataSource.config.query}`;
  }
  
  return '';
}
