import * as vscode from 'vscode';
import { ProjectsProvider } from './providers/projectsProvider';
import { ProjectManager } from './models/projectManager';
import { VSCodeFileSystem } from './utils/vsCodeFileSystem';
import { createProject, createNote, createView, deleteProject, deleteView } from './utils/commands';
import { ViewProvider } from './views/viewProvider';

// Output channel for extension logs
let outputChannel: vscode.OutputChannel;

/**
 * Log a message to the output channel and console
 */
function log(message: string, type: 'info' | 'warn' | 'error' = 'info'): void {
  if (!outputChannel) {
    return;
  }
  
  const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
  const logMessage = `[${timestamp}] ${message}`;
  
  switch (type) {
    case 'error':
      console.error(logMessage);
      outputChannel.appendLine(`ERROR: ${message}`);
      break;
    case 'warn':
      console.warn(logMessage);
      outputChannel.appendLine(`WARNING: ${message}`);
      break;
    default:
      console.log(logMessage);
      outputChannel.appendLine(`INFO: ${message}`);
  }
}

/**
 * Register all commands for the extension
 */
function registerCommands(
  context: vscode.ExtensionContext,
  projectManager: ProjectManager,
  projectsProvider: ProjectsProvider,
  viewProvider: ViewProvider,
  treeView: vscode.TreeView<any>
): void {
  log('Registering commands...');
  
  const commands: { [key: string]: (...args: any[]) => any } = {
    'vscode-projects.showProjects': () => {
      log('Show projects command executed');
      treeView.reveal(null as any, { focus: true, select: false });
    },
    
    'vscode-projects.createProject': async () => {
      log('Create project command executed');
      try {
        await createProject(projectManager, projectsProvider);
      } catch (error) {
        log(`Error creating project: ${error}`, 'error');
        vscode.window.showErrorMessage(`Failed to create project: ${error}`);
      }
    },
    
    'vscode-projects.createNote': async () => {
      log('Create note command executed');
      try {
        await createNote(projectManager);
      } catch (error) {
        log(`Error creating note: ${error}`, 'error');
        vscode.window.showErrorMessage(`Failed to create note: ${error}`);
      }
    },
    
    'vscode-projects.openProject': async (projectId: string) => {
      log(`Open project command executed with projectId: ${projectId}`);
      try {
        // If no project ID is provided, prompt the user to select one
        if (!projectId) {
          const projects = projectManager.getProjects();
          if (projects.length === 0) {
            throw new Error('No projects exist. Create a project first.');
          }
          
          const projectItems = projects.map(project => ({
            label: project.name,
            id: project.id
          }));
          
          const selectedProject = await vscode.window.showQuickPick(projectItems, {
            placeHolder: 'Select a project to open'
          });
          
          if (!selectedProject) {
            return; // User cancelled
          }
          
          projectId = selectedProject.id;
          log(`User selected project: ${selectedProject.label} (${projectId})`);
        }
        
        await viewProvider.openProject(projectId);
      } catch (error) {
        log(`Error opening project: ${error}`, 'error');
        vscode.window.showErrorMessage(`Failed to open project: ${error}`);
      }
    },
    
    'vscode-projects.openView': async (projectId: string, viewId: string) => {
      log(`Open view command executed with projectId: ${projectId}, viewId: ${viewId}`);
      try {
        // If project ID is missing, prompt the user to select a project
        if (!projectId) {
          const projects = projectManager.getProjects();
          if (projects.length === 0) {
            throw new Error('No projects exist. Create a project first.');
          }
          
          const projectItems = projects.map(project => ({
            label: project.name,
            id: project.id
          }));
          
          const selectedProject = await vscode.window.showQuickPick(projectItems, {
            placeHolder: 'Select a project'
          });
          
          if (!selectedProject) {
            return; // User cancelled
          }
          
          projectId = selectedProject.id;
          log(`User selected project: ${selectedProject.label} (${projectId})`);
        }
        
        // If view ID is missing, prompt the user to select a view from the project
        if (!viewId) {
          const project = projectManager.getProject(projectId);
          if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
          }
          
          if (project.views.length === 0) {
            throw new Error(`Project ${project.name} has no views`);
          }
          
          const viewItems = project.views.map(view => ({
            label: view.name,
            description: `Type: ${view.type}`,
            id: view.id
          }));
          
          const selectedView = await vscode.window.showQuickPick(viewItems, {
            placeHolder: 'Select a view'
          });
          
          if (!selectedView) {
            return; // User cancelled
          }
          
          viewId = selectedView.id;
          log(`User selected view: ${selectedView.label} (${viewId})`);
        }
        
        await viewProvider.openView(projectId, viewId);
      } catch (error) {
        log(`Error opening view: ${error}`, 'error');
        vscode.window.showErrorMessage(`Failed to open view: ${error}`);
      }
    },
    
    'vscode-projects.refreshView': () => {
      log('Refresh view command executed');
      projectsProvider.refresh();
    },
    
    'vscode-projects.toggleArchives': () => {
      log('Toggle archives command executed');
      projectsProvider.toggleArchives();
    },
    
    'vscode-projects.createView': async () => {
      log('Create view command executed');
      try {
        await createView(projectManager);
        projectsProvider.refresh(); // Refresh the tree view to show the new view
      } catch (error) {
        log(`Error creating view: ${error}`, 'error');
        vscode.window.showErrorMessage(`Failed to create view: ${error}`);
      }
    },
    
    'vscode-projects.deleteProject': async () => {
      log('Delete project command executed');
      try {
        await deleteProject(projectManager, projectsProvider);
      } catch (error) {
        log(`Error deleting project: ${error}`, 'error');
        vscode.window.showErrorMessage(`Failed to delete project: ${error}`);
      }
    },
    
    'vscode-projects.deleteView': async () => {
      log('Delete view command executed');
      try {
        await deleteView(projectManager, projectsProvider);
      } catch (error) {
        log(`Error deleting view: ${error}`, 'error');
        vscode.window.showErrorMessage(`Failed to delete view: ${error}`);
      }
    }
  };
  
  // Register each command with proper error handling
  Object.keys(commands).forEach(commandId => {
    try {
      log(`Registering command: ${commandId}`);
      const disposable = vscode.commands.registerCommand(commandId, commands[commandId]);
      context.subscriptions.push(disposable);
      log(`Command registered successfully: ${commandId}`);
    } catch (error) {
      log(`Error registering command ${commandId}: ${error}`, 'error');
      vscode.window.showErrorMessage(`Failed to register command ${commandId}: ${error}`);
    }
  });
  
  log('All commands registered successfully');
}

/**
 * Called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext): void {
  // Create output channel
  outputChannel = vscode.window.createOutputChannel('VSCode Projects');
  context.subscriptions.push(outputChannel);
  
  log('Activating VSCode Projects extension');
  log(`Extension path: ${context.extensionPath}`);
  
  try {
    // Initialize the file system adapter
    const fileSystem = new VSCodeFileSystem();
    log('File system adapter initialized');
    
    // Initialize the project manager with the extension context
    const projectManager = new ProjectManager(context, fileSystem);
    log('Project manager initialized');
    
    // Create the view provider
    const viewProvider = new ViewProvider(context, projectManager);
    log('View provider initialized');
    
    // Create the projects tree data provider
    const projectsProvider = new ProjectsProvider(projectManager);
    log('Projects tree data provider initialized');
    
    // Register the tree view
    const treeView = vscode.window.createTreeView('vscode-projects-sidebar', {
      treeDataProvider: projectsProvider,
      showCollapseAll: true
    });
    log('Tree view registered with ID: vscode-projects-sidebar');
    
    // Register all commands
    registerCommands(context, projectManager, projectsProvider, viewProvider, treeView);
    
    // Add disposables to context
    context.subscriptions.push(
      outputChannel,
      treeView
    );
    
    log('VSCode Projects extension activated successfully');
    vscode.window.showInformationMessage('VSCode Projects extension activated!');
  } catch (error) {
    log(`Error during extension activation: ${error}`, 'error');
    vscode.window.showErrorMessage(`Failed to activate VSCode Projects extension: ${error}`);
  }
}

/**
 * Called when the extension is deactivated
 */
export function deactivate(): void {
  log('Deactivating VSCode Projects extension');
}
