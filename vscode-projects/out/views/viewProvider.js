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
exports.ViewProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
/**
 * ViewProvider handles the webview panel for displaying project data
 */
class ViewProvider {
    constructor(context, projectManager) {
        this.context = context;
        this.projectManager = projectManager;
        this.webviewPanels = new Map();
    }
    /**
     * Opens a specific view from a project
     */
    async openView(projectId, viewId) {
        try {
            const project = this.projectManager.getProject(projectId);
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`);
            }
            const view = project.views.find(v => v.id === viewId);
            if (!view) {
                throw new Error(`View with ID ${viewId} not found in project ${project.name}`);
            }
            await this.showView(project, view);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to open view: ${error}`);
        }
    }
    /**
     * Opens the default view for a project
     */
    async openProject(projectId) {
        try {
            const project = this.projectManager.getProject(projectId);
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`);
            }
            // Use the first view as default
            if (project.views.length > 0) {
                await this.showView(project, project.views[0]);
            }
            else {
                throw new Error(`Project ${project.name} has no views`);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to open project: ${error}`);
        }
    }
    /**
     * Shows a specific view in a webview panel
     */
    async showView(project, view) {
        // Generate a unique key for this view
        const viewKey = `${project.id}:${view.id}`;
        // Check if we already have a panel for this view
        const existingPanel = this.webviewPanels.get(viewKey);
        if (existingPanel) {
            // If the panel exists, reveal it
            existingPanel.reveal();
            return;
        }
        // Create a new webview panel
        const panel = vscode.window.createWebviewPanel('projectsView', `${project.name} - ${view.name}`, vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(this.context.extensionPath, 'media'))
            ]
        });
        // Store the panel
        this.webviewPanels.set(viewKey, panel);
        // Handle panel disposal
        panel.onDidDispose(() => {
            this.webviewPanels.delete(viewKey);
        });
        // Query project data
        const dataframe = await this.projectManager.queryProject(project);
        // Set the webview HTML
        panel.webview.html = this.getWebviewContent(panel.webview, project, view, dataframe);
        // Handle webview messages
        panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'openFile':
                    if (message.path) {
                        const document = await vscode.workspace.openTextDocument(message.path);
                        await vscode.window.showTextDocument(document);
                    }
                    break;
                case 'refreshData':
                    // Refresh the data and update the view
                    const updatedDataframe = await this.projectManager.queryProject(project);
                    panel.webview.postMessage({
                        command: 'updateData',
                        data: updatedDataframe
                    });
                    break;
            }
        });
    }
    /**
     * Generates the HTML content for the webview
     */
    getWebviewContent(webview, project, view, dataframe) {
        // Get the style for the current VS Code theme
        const isDarkTheme = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark;
        // Base CSS for the view
        const baseCss = `
      :root {
        --container-background: ${isDarkTheme ? '#252526' : '#f3f3f3'};
        --item-background: ${isDarkTheme ? '#2d2d2d' : '#ffffff'};
        --text-color: ${isDarkTheme ? '#e7e7e7' : '#333333'};
        --border-color: ${isDarkTheme ? '#3c3c3c' : '#dddddd'};
        --highlight-color: ${isDarkTheme ? '#264f78' : '#ddddff'};
        --header-background: ${isDarkTheme ? '#333333' : '#eeeeee'};
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: var(--text-color);
        background-color: var(--container-background);
        padding: 0;
        margin: 0;
      }
      
      .toolbar {
        padding: 8px;
        background-color: var(--header-background);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
      }
      
      .toolbar button {
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        padding: 4px 8px;
        margin-right: 8px;
        cursor: pointer;
      }
      
      .toolbar button:hover {
        background-color: var(--highlight-color);
      }
      
      .container {
        padding: 16px;
      }
      
      .card {
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 8px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
      }
      
      th {
        text-align: left;
        background-color: var(--header-background);
        padding: 8px;
        border-bottom: 2px solid var(--border-color);
      }
      
      td {
        padding: 8px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .file-link {
        color: var(--text-color);
        text-decoration: underline;
        cursor: pointer;
      }
      
      .file-link:hover {
        text-decoration: none;
      }
      
      .board-container {
        display: flex;
        overflow-x: auto;
        padding: 16px;
        gap: 16px;
      }
      
      .board-column {
        min-width: 250px;
        background-color: var(--header-background);
        border-radius: 4px;
        padding: 8px;
      }
      
      .column-header {
        font-weight: bold;
        padding: 8px;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 8px;
      }
      
      .board-card {
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 8px;
      }
    `;
        // Determine which view component to render
        let viewComponent = '';
        switch (view.type) {
            case 'table':
                viewComponent = this.renderTableView(dataframe);
                break;
            case 'board':
                viewComponent = this.renderBoardView(dataframe, view);
                break;
            case 'calendar':
                viewComponent = this.renderCalendarView(dataframe, view);
                break;
            case 'gallery':
                viewComponent = this.renderGalleryView(dataframe);
                break;
            default:
                viewComponent = `<div class="container">
          <div class="card">
            <h2>Unsupported view type: ${view.type}</h2>
            <p>This view type is not yet implemented.</p>
          </div>
        </div>`;
        }
        return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${project.name} - ${view.name}</title>
        <style>${baseCss}</style>
      </head>
      <body>
        <div class="toolbar">
          <button id="refreshBtn">Refresh</button>
          <span>${project.name} - ${view.name}</span>
        </div>
        
        ${viewComponent}
        
        <script>
          (function() {
            // Convert dataframe to a JavaScript object
            const dataframe = ${JSON.stringify(dataframe)};
            
            // Event listeners
            document.getElementById('refreshBtn').addEventListener('click', () => {
              vscode.postMessage({
                command: 'refreshData'
              });
            });
            
            // Add click event listener to file links
            document.querySelectorAll('.file-link').forEach(link => {
              link.addEventListener('click', () => {
                vscode.postMessage({
                  command: 'openFile',
                  path: link.dataset.path
                });
              });
            });
            
            // Handle messages from the extension
            window.addEventListener('message', event => {
              const message = event.data;
              switch (message.command) {
                case 'updateData':
                  // This would require a more sophisticated implementation
                  // to update the view without a full page reload
                  location.reload();
                  break;
              }
            });
            
            // Initialize the view with data
            // This would be implemented differently for each view type
            
            const vscode = acquireVsCodeApi();
          })();
        </script>
      </body>
      </html>`;
    }
    /**
     * Renders a table view of the data
     */
    renderTableView(dataframe) {
        if (dataframe.records.length === 0) {
            return `<div class="container">
        <div class="card">
          <h2>No data</h2>
          <p>This project has no data records.</p>
        </div>
      </div>`;
        }
        // Get visible fields (could be customized based on view config)
        const visibleFields = dataframe.fields;
        let tableHtml = `<div class="container">
      <table>
        <thead>
          <tr>
            ${visibleFields.map(field => `<th>${field.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>`;
        // Add table rows
        dataframe.records.forEach(record => {
            tableHtml += `<tr>`;
            visibleFields.forEach(field => {
                const value = record.values[field.name];
                // For file paths, make them clickable
                if (field.name === 'path' && typeof value === 'string') {
                    tableHtml += `<td>
            <span class="file-link" data-path="${value}">${path.basename(value)}</span>
          </td>`;
                }
                else {
                    // Format different data types appropriately
                    let displayValue = '';
                    if (value === null || value === undefined) {
                        displayValue = '';
                    }
                    else if (value instanceof Date) {
                        displayValue = value.toLocaleDateString();
                    }
                    else if (Array.isArray(value)) {
                        displayValue = value.filter(v => v !== null && v !== undefined).join(', ');
                    }
                    else {
                        displayValue = String(value);
                    }
                    tableHtml += `<td>${displayValue}</td>`;
                }
            });
            tableHtml += `</tr>`;
        });
        tableHtml += `</tbody></table></div>`;
        return tableHtml;
    }
    /**
     * Renders a board view of the data
     */
    renderBoardView(dataframe, view) {
        if (dataframe.records.length === 0) {
            return `<div class="container">
        <div class="card">
          <h2>No data</h2>
          <p>This project has no data records.</p>
        </div>
      </div>`;
        }
        // In a real implementation, we would use the view config to determine
        // the grouping field. For now, we'll use a placeholder approach.
        const statusField = view.config.groupByField || 'status';
        // Group records by the status field
        const groups = new Map();
        // Add a default "No Status" group
        groups.set('No Status', []);
        dataframe.records.forEach(record => {
            // Ensure status is always a string
            let statusValue = record.values[statusField];
            let status = 'No Status';
            if (statusValue !== null && statusValue !== undefined) {
                status = String(statusValue);
            }
            if (!groups.has(status)) {
                groups.set(status, []);
            }
            const recordsForStatus = groups.get(status);
            if (recordsForStatus) {
                recordsForStatus.push(record);
            }
        });
        let boardHtml = `<div class="board-container">`;
        // Create a column for each status group
        groups.forEach((records, status) => {
            boardHtml += `
        <div class="board-column">
          <div class="column-header">${String(status)} (${records.length})</div>`;
            // Add cards for each record in this group
            records.forEach(record => {
                let title = '';
                if (record.values.name !== undefined) {
                    title = String(record.values.name);
                }
                else if (record.values.title !== undefined) {
                    title = String(record.values.title);
                }
                else {
                    title = record.id;
                }
                const description = record.values.description !== undefined ? String(record.values.description) : '';
                const filePath = record.values.path !== undefined ? String(record.values.path) : '';
                boardHtml += `
          <div class="board-card">
            <div class="file-link" data-path="${filePath}">${title}</div>
            <div>${description}</div>
          </div>`;
            });
            boardHtml += `</div>`;
        });
        boardHtml += `</div>`;
        return boardHtml;
    }
    /**
     * Renders a calendar view of the data
     */
    renderCalendarView(dataframe, view) {
        // A real implementation would use the view config to determine the date field
        // and build a proper calendar. This is a simplified placeholder.
        return `<div class="container">
      <div class="card">
        <h2>Calendar View</h2>
        <p>Calendar view implementation is a placeholder.</p>
        <p>This would display records organized by date.</p>
      </div>
    </div>`;
    }
    /**
     * Renders a gallery view of the data
     */
    renderGalleryView(dataframe) {
        // A real implementation would create a grid of cards with images if available
        return `<div class="container">
      <div class="card">
        <h2>Gallery View</h2>
        <p>Gallery view implementation is a placeholder.</p>
        <p>This would display records in a grid with image previews.</p>
      </div>
    </div>`;
    }
}
exports.ViewProvider = ViewProvider;
//# sourceMappingURL=viewProvider.js.map