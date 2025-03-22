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
exports.createNote = exports.createProject = void 0;
const vscode = __importStar(require("vscode"));
/**
 * Creates a new project
 */
async function createProject(projectManager, projectsProvider) {
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
        let projectUri;
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
            }
            else {
                return;
            }
        }
        // Create the project
        await projectManager.createProject(projectName, projectUri);
        // Refresh the tree view
        projectsProvider.refresh();
        vscode.window.showInformationMessage(`Project "${projectName}" created successfully.`);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to create project: ${error}`);
    }
}
exports.createProject = createProject;
/**
 * Creates a new note for a project
 */
async function createNote(projectManager) {
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
        let templatePath;
        if (selectedProjectItem.project.templates && selectedProjectItem.project.templates.length > 0) {
            const templateItems = selectedProjectItem.project.templates.map(template => ({
                label: template.replace(/^.*[\\\/]/, ''),
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
        const filePath = await projectManager.createNote(selectedProjectItem.project, noteName, templatePath);
        // Open the created file
        const uri = vscode.Uri.file(filePath);
        await vscode.window.showTextDocument(uri);
        vscode.window.showInformationMessage(`Note "${noteName}" created successfully.`);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to create note: ${error}`);
    }
}
exports.createNote = createNote;
/**
 * Helper function to get a description for a data source
 */
function getDataSourceDescription(project) {
    const dataSource = project.dataSource;
    if (dataSource.kind === 'folder') {
        return `Folder: ${dataSource.config.path}`;
    }
    else if (dataSource.kind === 'tag') {
        return `Tag: ${dataSource.config.tag}`;
    }
    else if (dataSource.kind === 'query') {
        return `Query: ${dataSource.config.query}`;
    }
    return '';
}
//# sourceMappingURL=commands.js.map