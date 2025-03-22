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
exports.ProjectsProvider = exports.ProjectTreeItem = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
/**
 * Tree item types for the Projects view
 */
var TreeItemType;
(function (TreeItemType) {
    TreeItemType[TreeItemType["Project"] = 0] = "Project";
    TreeItemType[TreeItemType["View"] = 1] = "View";
    TreeItemType[TreeItemType["Archive"] = 2] = "Archive";
})(TreeItemType || (TreeItemType = {}));
/**
 * Tree node for the Projects view
 */
class ProjectTreeItem extends vscode.TreeItem {
    constructor(label, type, collapsibleState, id, projectId, project, view) {
        super(label, collapsibleState);
        this.label = label;
        this.type = type;
        this.collapsibleState = collapsibleState;
        this.id = id;
        this.projectId = projectId;
        this.project = project;
        this.view = view;
        // Set context value for when-clause in package.json
        this.contextValue = type === TreeItemType.Project
            ? 'project'
            : type === TreeItemType.View
                ? 'view'
                : 'archive';
        // Set icon based on type
        switch (type) {
            case TreeItemType.Project:
                this.iconPath = new vscode.ThemeIcon('project');
                break;
            case TreeItemType.View:
                // Determine icon based on view type
                if (view?.type === 'table') {
                    this.iconPath = new vscode.ThemeIcon('list-tree');
                }
                else if (view?.type === 'board') {
                    this.iconPath = new vscode.ThemeIcon('layout');
                }
                else if (view?.type === 'calendar') {
                    this.iconPath = new vscode.ThemeIcon('calendar');
                }
                else if (view?.type === 'gallery') {
                    this.iconPath = new vscode.ThemeIcon('multiple-windows');
                }
                else {
                    this.iconPath = new vscode.ThemeIcon('preview');
                }
                break;
            case TreeItemType.Archive:
                this.iconPath = new vscode.ThemeIcon('archive');
                break;
        }
        // Set description based on data source for projects
        if (type === TreeItemType.Project && project?.dataSource) {
            if (project.dataSource.kind === 'folder') {
                this.description = `Folder: ${path.basename(project.dataSource.config.path)}`;
            }
            else if (project.dataSource.kind === 'tag') {
                this.description = `Tag: ${project.dataSource.config.tag}`;
            }
            else if (project.dataSource.kind === 'query') {
                this.description = `Query`;
            }
        }
        // Set command for when the item is clicked
        if (type === TreeItemType.View && projectId && id) {
            this.command = {
                command: 'vscode-projects.openView',
                title: 'Open View',
                arguments: [projectId, id]
            };
        }
        else if (type === TreeItemType.Project && id) {
            // For projects, show the default view when clicked
            this.command = {
                command: 'vscode-projects.openProject',
                title: 'Open Project',
                arguments: [id]
            };
        }
    }
}
exports.ProjectTreeItem = ProjectTreeItem;
/**
 * Tree data provider for the Projects view
 */
class ProjectsProvider {
    constructor(projectManager) {
        this.projectManager = projectManager;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        // This is the public property that VS Code will look for
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.showArchives = false;
        // Ensure we're properly implementing the TreeDataProvider interface
        console.log('ProjectsProvider constructor called');
    }
    /**
     * Refresh the tree view
     */
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    /**
     * Toggle whether to show archives
     */
    toggleArchives() {
        this.showArchives = !this.showArchives;
        this.refresh();
    }
    /**
     * Get the tree item for a given element
     * This method is required by the TreeDataProvider interface
     */
    getTreeItem(element) {
        console.log(`getTreeItem called for: ${element.label}`);
        return element;
    }
    /**
     * Get the children of a given element
     * This method is required by the TreeDataProvider interface
     */
    getChildren(element) {
        console.log(`getChildren called with element: ${element ? element.label : 'root'}`);
        try {
            if (!element) {
                // Root level - show projects and archives section
                const items = [];
                // Add projects
                const projects = this.projectManager.getProjects();
                console.log(`Found ${projects.length} projects`);
                if (projects.length === 0) {
                    // Add a placeholder item if no projects exist
                    items.push(new ProjectTreeItem('No projects found. Click the + button to create one.', TreeItemType.Project, vscode.TreeItemCollapsibleState.None));
                }
                else {
                    projects.forEach(project => {
                        items.push(new ProjectTreeItem(project.name, TreeItemType.Project, vscode.TreeItemCollapsibleState.Collapsed, project.id, project.id, project));
                    });
                }
                // Add archives section if enabled
                if (this.showArchives) {
                    const archives = this.projectManager.getArchives();
                    console.log(`Found ${archives.length} archived projects`);
                    if (archives.length > 0) {
                        items.push(new ProjectTreeItem('Archives', TreeItemType.Archive, vscode.TreeItemCollapsibleState.Collapsed));
                    }
                }
                return Promise.resolve(items);
            }
            else if (element.type === TreeItemType.Project && element.projectId) {
                // Project level - show views
                const project = this.projectManager.getProject(element.projectId);
                if (!project) {
                    return Promise.resolve([]);
                }
                return Promise.resolve(project.views.map(view => new ProjectTreeItem(view.name, TreeItemType.View, vscode.TreeItemCollapsibleState.None, view.id, project.id, project, view)));
            }
            else if (element.type === TreeItemType.Archive) {
                // Archive level - show archived projects
                const archives = this.projectManager.getArchives();
                return Promise.resolve(archives.map(archive => new ProjectTreeItem(archive.name, TreeItemType.Project, vscode.TreeItemCollapsibleState.Collapsed, archive.id, archive.id, archive)));
            }
            return Promise.resolve([]);
        }
        catch (error) {
            console.error('Error getting children:', error);
            return Promise.resolve([]);
        }
    }
}
exports.ProjectsProvider = ProjectsProvider;
//# sourceMappingURL=projectsProvider.js.map