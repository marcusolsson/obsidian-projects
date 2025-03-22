import * as vscode from 'vscode';
import * as path from 'path';
import { ProjectManager } from '../models/projectManager';
import { ProjectDefinition, ViewDefinition } from '../models/settings';
import { DataFrame } from '../models/dataframe';

/**
 * ViewProvider handles the webview panel for displaying project data
 */
export class ViewProvider {
  private webviewPanels = new Map<string, vscode.WebviewPanel>();
  
  constructor(
    private context: vscode.ExtensionContext,
    private projectManager: ProjectManager
  ) {}
  
  /**
   * Opens a specific view from a project
   */
  public async openView(projectId: string, viewId: string): Promise<void> {
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
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to open view: ${error}`);
    }
  }
  
  /**
   * Opens the default view for a project
   */
  public async openProject(projectId: string): Promise<void> {
    try {
      const project = this.projectManager.getProject(projectId);
      
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
      
      // Use the first view as default
      if (project.views.length > 0) {
        await this.showView(project, project.views[0]);
      } else {
        throw new Error(`Project ${project.name} has no views`);
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to open project: ${error}`);
    }
  }
  
  /**
   * Shows a specific view in a webview panel
   */
  private async showView(project: ProjectDefinition, view: ViewDefinition): Promise<void> {
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
    const panel = vscode.window.createWebviewPanel(
      'projectsView',
      `${project.name} - ${view.name}`,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this.context.extensionPath, 'media'))
        ]
      }
    );
    
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
        case 'editItem':
          if (message.recordId && message.recordData) {
            try {
              // Find the record in the dataframe
              const recordIndex = dataframe.records.findIndex(r => r.id === message.recordId);
              
              if (recordIndex === -1) {
                throw new Error(`Record with ID ${message.recordId} not found`);
              }
              
              // Update the record values
              const updatedRecord = {
                ...dataframe.records[recordIndex],
                values: message.recordData
              };
              
              // Update the local dataframe
              dataframe.records[recordIndex] = updatedRecord;
              
              // Note: No direct dataframe update method available in ProjectManager
              // We'll just refresh the view with the updated dataframe
              // This will be lost on refresh, but serves as a preview until the user saves the file
              
              // In a complete implementation, we would need to:
              // 1. Parse the file
              // 2. Update its frontmatter 
              // 3. Save it back
              // For now, we'll just update the in-memory representation
              
              // Refresh the view
              panel.webview.html = this.getWebviewContent(panel.webview, project, view, dataframe);
              
              // Send confirmation back to webview
              panel.webview.postMessage({
                command: 'itemUpdated',
                recordId: message.recordId,
                success: true
              });
            } catch (error) {
              console.error('Failed to update item:', error);
              panel.webview.postMessage({
                command: 'itemUpdated',
                recordId: message.recordId,
                success: false,
                error: String(error)
              });
            }
          }
          break;
        case 'refreshData':
          // Refresh the data and completely regenerate the view
          const updatedDataframe = await this.projectManager.queryProject(project);
          
          // Instead of sending just the data update, regenerate the entire HTML content
          // This ensures the view is completely rebuilt with the current configuration
          panel.webview.html = this.getWebviewContent(panel.webview, project, view, updatedDataframe);
          break;
        case 'updateCalendarConfig':
          // Update view configuration with calendar settings
          if (view.type === 'calendar' && message.config) {
            // Create a copy of the current view to modify
            const updatedView = { ...view };
            
            // Create or update the config object
            updatedView.config = {
              ...updatedView.config,
              ...message.config
            };
            
            // Update the project with the new view configuration
            const updatedProject = {
              ...project,
              views: project.views.map(v => v.id === view.id ? updatedView : v)
            };
            
            // Save the updated project
            await this.projectManager.updateProject(updatedProject);
            
            // Update our local reference
            view = updatedView;
            
            // Send confirmation back to webview
            panel.webview.postMessage({
              command: 'configUpdated',
              config: updatedView.config
            });
          }
          break;
      }
    });
  }
  
  /**
   * Find a suitable date field from the available fields
   */
  private findSuitableDateField(fields: any[]): string {
    // Try to find a field with 'date' in the name
    const dateField = fields.find(field => 
      field.name.toLowerCase().includes('date') ||
      field.name.toLowerCase().includes('time') ||
      field.name.toLowerCase().includes('deadline') ||
      field.name.toLowerCase().includes('due')
    );
    
    return dateField ? dateField.name : 'date';
  }
  
  /**
   * Get all date-like fields from the available fields
   */
  private findDateFields(fields: any[]): any[] {
    // Return fields that are likely to contain dates
    return fields.filter(field => 
      field.name.toLowerCase().includes('date') ||
      field.name.toLowerCase().includes('time') ||
      field.name.toLowerCase().includes('deadline') ||
      field.name.toLowerCase().includes('due') ||
      field.name.toLowerCase().includes('created') ||
      field.name.toLowerCase().includes('modified')
    );
  }
  
  /**
   * Generates the HTML content for the webview
   */
  private getWebviewContent(
    webview: vscode.Webview,
    project: ProjectDefinition,
    view: ViewDefinition,
    dataframe: DataFrame
  ): string {
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
      
      /* Filter and Sort Styles */
      .filter-bar {
        margin-bottom: 16px;
        background-color: var(--item-background);
        border-radius: 4px;
        padding: 8px;
        border: 1px solid var(--border-color);
      }
      
      .filter-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .search-box {
        flex-grow: 1;
        padding: 4px 8px;
        border: 1px solid var(--border-color);
        background-color: var(--container-background);
        color: var(--text-color);
      }
      
      .filter-button {
        padding: 4px 8px;
        background-color: var(--header-background);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        cursor: pointer;
      }
      
      .filter-panel {
        margin-top: 8px;
        padding: 8px;
        border-top: 1px solid var(--border-color);
      }
      
      .filter-builder {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .filter-condition {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px;
        background-color: var(--container-background);
        border-radius: 4px;
        border: 1px solid var(--border-color);
      }
      
      .filter-join, .filter-property, .filter-operator, .filter-value {
        padding: 4px;
        background-color: var(--container-background);
        color: var(--text-color);
        border: 1px solid var(--border-color);
      }
      
      .filter-join {
        min-width: 60px;
      }
      
      .filter-property {
        min-width: 120px;
      }
      
      .filter-operator {
        min-width: 120px;
      }
      
      .filter-value {
        flex-grow: 1;
      }
      
      .filter-remove {
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
        opacity: 0.7;
      }
      
      .filter-remove:hover {
        opacity: 1;
      }
      
      .filter-add {
        align-self: flex-start;
        padding: 4px 8px;
        background-color: var(--header-background);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        cursor: pointer;
        margin-bottom: 8px;
      }
      
      .filter-saved {
        margin-top: 16px;
        border-top: 1px solid var(--border-color);
        padding-top: 16px;
      }
      
      .saved-filter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        margin-bottom: 8px;
        background-color: var(--container-background);
        border-radius: 4px;
        border: 1px solid var(--border-color);
      }
      
      .saved-filter-name {
        font-weight: bold;
      }
      
      .saved-filter-actions {
        display: flex;
        gap: 8px;
      }
      
      .filter-actions {
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
      }
      
      .th-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .sort-controls {
        display: flex;
        gap: 4px;
      }
      
      .sort-control {
        cursor: pointer;
        opacity: 0.6;
      }
      
      .sort-control:hover {
        opacity: 1;
      }
      
      .sort-active {
        opacity: 1;
        color: var(--highlight-color);
      }
      
      /* Calendar View Styles */
      .calendar-container {
        display: flex;
        flex-direction: column;
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .calendar-toolbar {
        display: flex;
        align-items: center;
        padding: 8px;
        background-color: var(--header-background);
        border-bottom: 1px solid var(--border-color);
      }
      
      .calendar-toolbar button {
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        padding: 4px 8px;
        margin-right: 8px;
        cursor: pointer;
      }
      
      .calendar-toolbar h2 {
        margin: 0 auto 0 16px;
        font-size: 1.2rem;
      }
      
      .calendar-filter {
        padding: 8px;
        background-color: var(--container-background);
        border-bottom: 1px solid var(--border-color);
      }
      
      .calendar-filter select {
        padding: 4px;
        background-color: var(--item-background);
        color: var(--text-color);
        border: 1px solid var(--border-color);
      }
      
      .calendar-grid {
        display: flex;
        flex-direction: column;
        padding: 8px;
      }
      
      .calendar-header {
        display: flex;
        border-bottom: 1px solid var(--border-color);
      }
      
      .calendar-header .calendar-cell {
        font-weight: bold;
        text-align: center;
        padding: 8px;
      }
      
      .calendar-body {
        display: flex;
        flex-direction: column;
      }
      
      .calendar-row {
        display: flex;
        border-bottom: 1px solid var(--border-color);
      }
      
      .calendar-row:last-child {
        border-bottom: none;
      }
      
      .calendar-cell {
        flex: 1;
        min-height: 100px;
        padding: 4px;
        border-right: 1px solid var(--border-color);
        position: relative;
      }
      
      .calendar-cell:last-child {
        border-right: none;
      }
      
      .calendar-cell.empty {
        background-color: var(--container-background);
      }
      
      .calendar-cell.today {
        background-color: var(--highlight-color);
      }
      
      .calendar-date {
        font-weight: bold;
        padding: 4px;
        text-align: right;
      }
      
      .calendar-events {
        margin-top: 4px;
        font-size: 0.9em;
        overflow: hidden;
      }
      
      .calendar-event {
        padding: 2px 4px;
        margin-bottom: 2px;
        background-color: var(--header-background);
        border-radius: 2px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color 0.1s, border-color 0.1s;
      }
      
      .calendar-event:hover {
        background-color: var(--highlight-color);
        border-color: var(--text-color);
      }
      
      .more-events {
        font-size: 0.8em;
        text-align: center;
        color: var(--text-color);
        opacity: 0.8;
      }
      
      .event-details {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--item-background);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 16px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        max-width: 80%;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 10;
      }
      
      .event-details-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      
      .event-details-header h3 {
        margin: 0;
      }
      
      .event-details-header button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2em;
        color: var(--text-color);
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
            
            // Handle filter panel toggle
            const showFiltersBtn = document.getElementById('showFiltersBtn');
            const filterPanel = document.getElementById('filterPanel');
            if (showFiltersBtn && filterPanel) {
              showFiltersBtn.addEventListener('click', () => {
                const isDisplayed = filterPanel.style.display !== 'none';
                filterPanel.style.display = isDisplayed ? 'none' : 'block';
                showFiltersBtn.textContent = isDisplayed ? 'Show Filters' : 'Hide Filters';
              });
            }
            
            // Clear filters
            const clearFilterBtn = document.getElementById('clearFilterBtn');
            if (clearFilterBtn) {
              clearFilterBtn.addEventListener('click', () => {
                // Reset all filter inputs
                document.querySelectorAll('.filter-value').forEach(input => {
                  input.value = '';
                });
                // Reset search box
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                  searchInput.value = '';
                }
                // Show all rows
                document.querySelectorAll('tbody tr').forEach(row => {
                  row.style.display = '';
                });
              });
            }
            
            // Simple search functionality
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
              searchInput.addEventListener('input', () => {
                const searchText = searchInput.value.toLowerCase();
                document.querySelectorAll('tbody tr').forEach(row => {
                  const rowText = row.textContent.toLowerCase();
                  row.style.display = rowText.includes(searchText) ? '' : 'none';
                });
              });
            }
            
            // Dynamic filter builder functionality
            const filterBuilder = document.getElementById('filterBuilder');
            const addFilterBtn = document.getElementById('addFilterBtn');
            const saveFilterBtn = document.getElementById('saveFilterBtn');
            const savedFiltersList = document.getElementById('savedFiltersList');
            const savedFiltersContainer = document.getElementById('savedFilters');
            
            if (filterBuilder && addFilterBtn) {
              // Function to create a new filter condition element
              function createFilterCondition(isFirstCondition = false) {
                const conditionId = 'filter-' + Date.now();
                const condition = document.createElement('div');
                condition.className = 'filter-condition';
                condition.id = conditionId;
                
                // Logical join operator (AND/OR) for conditions after the first one
                if (!isFirstCondition) {
                  const joinSelect = document.createElement('select');
                  joinSelect.className = 'filter-join';
                  
                  const andOption = document.createElement('option');
                  andOption.value = 'and';
                  andOption.textContent = 'AND';
                  andOption.selected = true;
                  
                  const orOption = document.createElement('option');
                  orOption.value = 'or';
                  orOption.textContent = 'OR';
                  
                  joinSelect.appendChild(andOption);
                  joinSelect.appendChild(orOption);
                  condition.appendChild(joinSelect);
                }
                
                // Property selector
                const propertySelect = document.createElement('select');
                propertySelect.className = 'filter-property';
                
                // Add default empty option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select property...';
                propertySelect.appendChild(defaultOption);
                
                // Add options for each field in the dataframe
                dataframe.fields.forEach(field => {
                  const option = document.createElement('option');
                  option.value = field.name;
                  option.textContent = field.name;
                  propertySelect.appendChild(option);
                });
                
                // Operator selector
                const operatorSelect = document.createElement('select');
                operatorSelect.className = 'filter-operator';
                
                const operators = [
                  { value: 'isNotEmpty', text: 'is not empty' },
                  { value: 'isEmpty', text: 'is empty' },
                  { value: 'is', text: 'is' },
                  { value: 'isNot', text: 'is not' },
                  { value: 'contains', text: 'contains' },
                  { value: 'doesNotContain', text: 'does not contain' }
                ];
                
                operators.forEach(op => {
                  const option = document.createElement('option');
                  option.value = op.value;
                  option.textContent = op.text;
                  operatorSelect.appendChild(option);
                });
                
                // Value input
                const valueInput = document.createElement('input');
                valueInput.type = 'text';
                valueInput.className = 'filter-value';
                valueInput.placeholder = 'Value...';
                
                // Remove button
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'filter-remove';
                removeBtn.textContent = '×';
                removeBtn.title = 'Remove condition';
                removeBtn.addEventListener('click', () => {
                  condition.remove();
                });
                
                // Add elements to condition
                condition.appendChild(propertySelect);
                condition.appendChild(operatorSelect);
                condition.appendChild(valueInput);
                condition.appendChild(removeBtn);
                
                // Handle operator change to show/hide value input
                operatorSelect.addEventListener('change', () => {
                  const operator = operatorSelect.value;
                  if (operator === 'isEmpty' || operator === 'isNotEmpty') {
                    valueInput.style.display = 'none';
                    valueInput.value = '';
                  } else {
                    valueInput.style.display = 'block';
                  }
                });
                
                // Initialize with correct display state
                if (operatorSelect.value === 'isEmpty' || operatorSelect.value === 'isNotEmpty') {
                  valueInput.style.display = 'none';
                }
                
                return condition;
              }
              
              // Add a new condition when the "Add Condition" button is clicked
              addFilterBtn.addEventListener('click', () => {
                const isFirstCondition = filterBuilder.children.length === 0;
                const condition = createFilterCondition(isFirstCondition);
                filterBuilder.appendChild(condition);
              });
              
              // Add an initial condition if the filter builder is empty
              if (filterBuilder.children.length === 0) {
                addFilterBtn.click();
              }
              
              // Save filter functionality
              if (saveFilterBtn) {
                saveFilterBtn.addEventListener('click', () => {
                  // Check if we have valid conditions to save
                  const conditions = [];
                  let hasValidConditions = false;
                  
                  document.querySelectorAll('.filter-condition').forEach(conditionEl => {
                    const propertySelect = conditionEl.querySelector('.filter-property');
                    const operatorSelect = conditionEl.querySelector('.filter-operator');
                    const valueInput = conditionEl.querySelector('.filter-value');
                    
                    if (propertySelect.value) {
                      hasValidConditions = true;
                      conditions.push({
                        property: propertySelect.value,
                        operator: operatorSelect.value,
                        value: valueInput.value
                      });
                    }
                  });
                  
                  if (!hasValidConditions) {
                    alert('Please add at least one valid filter condition');
                    return;
                  }
                  
                  // Prompt for filter name
                  const filterName = prompt('Enter a name for this filter:');
                  if (!filterName) return;
                  
                  // Save filter to localStorage
                  const viewKey = 'project_filters_' + dataframe.id;
                  let savedFilters = JSON.parse(localStorage.getItem(viewKey) || '[]');
                  
                  const filter = {
                    id: 'filter_' + Date.now(),
                    name: filterName,
                    conditions: conditions
                  };
                  
                  savedFilters.push(filter);
                  localStorage.setItem(viewKey, JSON.stringify(savedFilters));
                  
                  // Add to UI
                  addSavedFilterToUI(filter);
                });
              }
              
              // Function to add a saved filter to the UI
              function addSavedFilterToUI(filter) {
                if (!savedFiltersContainer || !savedFiltersList) return;
                
                // Show saved filters container if it was hidden
                savedFiltersContainer.style.display = 'block';
                
                const filterItem = document.createElement('div');
                filterItem.className = 'saved-filter';
                filterItem.dataset.filterId = filter.id;
                
                const nameEl = document.createElement('div');
                nameEl.className = 'saved-filter-name';
                nameEl.textContent = filter.name;
                
                const actionsEl = document.createElement('div');
                actionsEl.className = 'saved-filter-actions';
                
                const applyBtn = document.createElement('button');
                applyBtn.className = 'filter-button';
                applyBtn.textContent = 'Apply';
                applyBtn.addEventListener('click', () => {
                  // Clear existing filter conditions
                  filterBuilder.innerHTML = '';
                  
                  // Add conditions from saved filter
                  filter.conditions.forEach(condition => {
                    const conditionEl = createFilterCondition();
                    
                    const propertySelect = conditionEl.querySelector('.filter-property');
                    const operatorSelect = conditionEl.querySelector('.filter-operator');
                    const valueInput = conditionEl.querySelector('.filter-value');
                    
                    propertySelect.value = condition.property;
                    operatorSelect.value = condition.operator;
                    valueInput.value = condition.value;
                    
                    // Update visibility of value input
                    if (condition.operator === 'isEmpty' || condition.operator === 'isNotEmpty') {
                      valueInput.style.display = 'none';
                    }
                    
                    filterBuilder.appendChild(conditionEl);
                  });
                  
                  // Apply the filter
                  applyFiltersBtn.click();
                });
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'filter-button';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => {
                  // Remove from UI
                  filterItem.remove();
                  
                  // Remove from localStorage
                  const viewKey = 'project_filters_' + dataframe.id;
                  let savedFilters = JSON.parse(localStorage.getItem(viewKey) || '[]');
                  savedFilters = savedFilters.filter(f => f.id !== filter.id);
                  localStorage.setItem(viewKey, JSON.stringify(savedFilters));
                  
                  // Hide container if no saved filters left
                  if (savedFilters.length === 0) {
                    savedFiltersContainer.style.display = 'none';
                  }
                });
                
                actionsEl.appendChild(applyBtn);
                actionsEl.appendChild(deleteBtn);
                
                filterItem.appendChild(nameEl);
                filterItem.appendChild(actionsEl);
                
                savedFiltersList.appendChild(filterItem);
              }
              
              // Load saved filters on page load
              const viewKey = 'project_filters_' + dataframe.id;
              const savedFilters = JSON.parse(localStorage.getItem(viewKey) || '[]');
              
              if (savedFilters.length > 0 && savedFiltersContainer && savedFiltersList) {
                savedFiltersContainer.style.display = 'block';
                savedFilters.forEach(filter => {
                  addSavedFilterToUI(filter);
                });
              }
            }
            
            // Apply filters
            const applyFiltersBtn = document.getElementById('applyFiltersBtn');
            if (applyFiltersBtn) {
              applyFiltersBtn.addEventListener('click', () => {
                const filterConditions = [];
                
                // Get filters from the dynamic filter builder
                document.querySelectorAll('.filter-condition').forEach((conditionEl, index) => {
                  const propertySelect = conditionEl.querySelector('.filter-property');
                  const operatorSelect = conditionEl.querySelector('.filter-operator');
                  const valueInput = conditionEl.querySelector('.filter-value');
                  const joinSelect = conditionEl.querySelector('.filter-join');
                  
                  if (propertySelect.value) {
                    const property = propertySelect.value;
                    const operator = operatorSelect.value;
                    const value = valueInput.value;
                    // Get the logical join (AND/OR) if not the first condition
                    const join = index > 0 && joinSelect ? joinSelect.value : null;
                    
                    // Always include isEmpty/isNotEmpty operators even without value
                    if (value || operator === 'isEmpty' || operator === 'isNotEmpty') {
                      filterConditions.push({ 
                        field: property, 
                        operator, 
                        value,
                        join 
                      });
                    }
                  }
                });
                
                // Apply filters to rows
                document.querySelectorAll('tbody tr').forEach(row => {
                  let showRow = true;
                  
                  // If no filters, show all rows
                  if (filterConditions.length === 0) {
                    showRow = true;
                  } else {
                    // Process first condition
                    if (filterConditions.length > 0) {
                      showRow = evaluateFilterCondition(filterConditions[0], row);
                      
                      // Process additional conditions with AND/OR logic
                      for (let i = 1; i < filterConditions.length; i++) {
                        const condition = filterConditions[i];
                        const result = evaluateFilterCondition(condition, row);
                        
                        if (condition.join === 'or') {
                          showRow = showRow || result;
                        } else { // 'and' is default
                          showRow = showRow && result;
                        }
                      }
                    }
                  }
                  
                  row.style.display = showRow ? '' : 'none';
                });
                
                // Store the applied filters in a data attribute on the table
                const table = document.querySelector('table');
                if (table) {
                  table.dataset.appliedFilters = JSON.stringify(filterConditions);
                }
              });
              
              // Helper function to evaluate a single filter condition against a row
              function evaluateFilterCondition(condition, row) {
                const cellIndex = [...document.querySelectorAll('th')].findIndex(
                  th => th.textContent.trim() === condition.field
                );
                
                if (cellIndex >= 0) {
                  const cell = row.cells[cellIndex];
                  const cellText = cell.textContent.toLowerCase();
                  const filterValue = condition.value.toLowerCase();
                  
                  switch (condition.operator) {
                    case 'isNotEmpty':
                      return cellText !== '';
                    case 'isEmpty':
                      return cellText === '';
                    case 'is':
                      return cellText === filterValue;
                    case 'isNot':
                      return cellText !== filterValue;
                    case 'contains':
                      return cellText.includes(filterValue);
                    case 'doesNotContain':
                      return !cellText.includes(filterValue);
                    default:
                      return true; // Unknown operator
                  }
                }
                
                return true; // Column not found
              }
            }
            
            // Sorting functionality
            document.querySelectorAll('.sort-control').forEach(sortControl => {
              sortControl.addEventListener('click', () => {
                const field = sortControl.dataset.field;
                const isAscending = sortControl.classList.contains('sort-asc');
                
                // Find the column index
                const headers = document.querySelectorAll('th');
                const columnIndex = [...headers].findIndex(
                  header => header.textContent.includes(field)
                );
                
                if (columnIndex >= 0) {
                  const tbody = document.querySelector('tbody');
                  const rows = [...tbody.querySelectorAll('tr')];
                  
                  const sortedRows = rows.sort((a, b) => {
                    const aValue = a.cells[columnIndex].textContent;
                    const bValue = b.cells[columnIndex].textContent;
                    
                    // Try to convert to numbers if possible
                    const aNum = Number(aValue);
                    const bNum = Number(bValue);
                    
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                      return isAscending ? aNum - bNum : bNum - aNum;
                    }
                    
                    // Otherwise compare as strings
                    return isAscending 
                      ? aValue.localeCompare(bValue)
                      : bValue.localeCompare(aValue);
                  });
                  
                  // Remove existing rows
                  rows.forEach(row => row.remove());
                  
                  // Add sorted rows
                  sortedRows.forEach(row => tbody.appendChild(row));
                  
                  // Update active sort indicator
                  document.querySelectorAll('.sort-control').forEach(sc => {
                    sc.classList.remove('sort-active');
                  });
                  sortControl.classList.add('sort-active');
                }
              });
            });
            
            // Handle messages from the extension
            window.addEventListener('message', event => {
              const message = event.data;
              switch (message.command) {
                case 'configUpdated':
                  console.log('Configuration updated, triggering full view refresh');
                  // Configuration was successfully updated, now refresh the entire view
                  vscode.postMessage({
                    command: 'refreshData'
                  });
                  break;
              }
            });
            
            // Initialize the view with data
            // This would be implemented differently for each view type
            
            // Calendar specific functionality
            const prevMonthBtn = document.getElementById('prevMonth');
            const nextMonthBtn = document.getElementById('nextMonth');
            const todayBtn = document.getElementById('todayBtn');
            const dateFieldSelect = document.getElementById('dateFieldSelect');
            const currentMonthDisplay = document.getElementById('currentMonthDisplay');
            const eventDetails = document.getElementById('eventDetails');
            const selectedDateEl = document.getElementById('selectedDate');
            const closeEventDetailsBtn = document.getElementById('closeEventDetails');
            const eventDetailsList = document.getElementById('eventDetailsList');
            
            if (prevMonthBtn && nextMonthBtn && todayBtn && dateFieldSelect) {
              // Current view state
              let currentViewDate = new Date();
              
              // Function to render a month
              const renderMonth = (year, month) => {
                currentViewDate = new Date(year, month, 1);
                
                // Update month display
                if (currentMonthDisplay) {
                  currentMonthDisplay.textContent = currentViewDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  });
                }
                
                // Don't refresh here - we'll refresh after config update confirmation
                // in the message handler instead
              };
              
              // Initialize the current view date from config if available
              const configMonth = ${JSON.stringify(view.config?.month)};
              const configYear = ${JSON.stringify(view.config?.year)};
              
              if (configMonth !== undefined && configYear !== undefined) {
                currentViewDate = new Date(configYear, configMonth, 1);
              }
              
              // Navigate to previous month
              prevMonthBtn.addEventListener('click', () => {
                const prevMonth = currentViewDate.getMonth() - 1;
                const year = prevMonth < 0 ? currentViewDate.getFullYear() - 1 : currentViewDate.getFullYear();
                const month = prevMonth < 0 ? 11 : prevMonth;
                
                // Save the new month state to configuration
                vscode.postMessage({
                  command: 'updateCalendarConfig',
                  config: {
                    year: year,
                    month: month,
                    dateField: dateFieldSelect.value
                  }
                });
                
                // Update the UI without a full refresh
                renderMonth(year, month);
              });
              
              // Navigate to next month
              nextMonthBtn.addEventListener('click', () => {
                const nextMonth = currentViewDate.getMonth() + 1;
                const year = nextMonth > 11 ? currentViewDate.getFullYear() + 1 : currentViewDate.getFullYear();
                const month = nextMonth > 11 ? 0 : nextMonth;
                
                // Save the new month state to configuration
                vscode.postMessage({
                  command: 'updateCalendarConfig',
                  config: {
                    year: year,
                    month: month,
                    dateField: dateFieldSelect.value
                  }
                });
                
                // Update the UI without a full refresh
                renderMonth(year, month);
              });
              
              // Navigate to today
              todayBtn.addEventListener('click', () => {
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth();
                
                // Save the new month state to configuration
                vscode.postMessage({
                  command: 'updateCalendarConfig',
                  config: {
                    year: year,
                    month: month,
                    dateField: dateFieldSelect.value
                  }
                });
                
                // Update the UI without a full refresh
                renderMonth(year, month);
              });
              
              // Change date field
              dateFieldSelect.addEventListener('change', () => {
                // Save the selected date field to the configuration
                vscode.postMessage({
                  command: 'updateCalendarConfig',
                  config: {
                    year: currentViewDate.getFullYear(),
                    month: currentViewDate.getMonth(),
                    dateField: dateFieldSelect.value
                  }
                });
                // We'll wait for the configUpdated message to trigger the refresh
              });
              
              // Add click handlers for calendar events
              document.querySelectorAll('.calendar-event').forEach(eventEl => {
                eventEl.addEventListener('click', (e) => {
                  // Get the event details
                  const recordId = eventEl.dataset.recordId;
                  const filePath = eventEl.dataset.path;
                  
                  // Handle Ctrl+click to open file directly
                  if (e.ctrlKey || e.metaKey) { // metaKey for Mac
                    if (filePath) {
                      vscode.postMessage({
                        command: 'openFile',
                        path: filePath
                      });
                    }
                    return;
                  }
                  
                  // Find the record in the dataframe
                  const record = dataframe.records.find(r => r.id === recordId);
                  if (!record) return;
                  
                  // Create and show the item editor modal
                  const name = record.values.name || record.values.title || record.id;
                  const editorModal = createEditModal(name, record.id, record.values, filePath);
                  document.body.appendChild(editorModal);
                });
              });
              
              // Function to create an edit modal for a record
              function createEditModal(itemName, recordId, values, filePath) {
                // Create the modal container
                const modal = document.createElement('div');
                modal.className = 'event-details';
                modal.id = 'itemEditorModal';
                modal.style.display = 'block';
                
                // Create header
                const header = document.createElement('div');
                header.className = 'event-details-header';
                
                const title = document.createElement('h3');
                title.textContent = 'Edit Item: ' + itemName;
                
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '✕';
                closeBtn.addEventListener('click', () => {
                  modal.remove();
                });
                
                header.appendChild(title);
                header.appendChild(closeBtn);
                modal.appendChild(header);
                
                // Create form
                const form = document.createElement('form');
                form.id = 'itemEditorForm';
                
                // Add fields for editing, filtering out system fields
                const editableFields = dataframe.fields.filter(f => 
                  !f.derived && 
                  f.name !== 'id' && 
                  f.name !== 'date' && 
                  f.name !== 'created' && 
                  f.name !== 'modified'
                );
                
                editableFields.forEach(field => {
                  const fieldValue = values[field.name] || '';
                  const fieldDiv = document.createElement('div');
                  fieldDiv.style.marginBottom = '12px';
                  
                  const label = document.createElement('label');
                  label.textContent = field.name + ':';
                  label.style.display = 'block';
                  label.style.marginBottom = '4px';
                  
                  const input = document.createElement('input');
                  input.type = 'text';
                  input.name = field.name;
                  input.value = fieldValue;
                  input.style.width = '100%';
                  input.style.padding = '4px';
                  input.style.backgroundColor = 'var(--container-background)';
                  input.style.color = 'var(--text-color)';
                  input.style.border = '1px solid var(--border-color)';
                  
                  fieldDiv.appendChild(label);
                  fieldDiv.appendChild(input);
                  form.appendChild(fieldDiv);
                });
                
                // Add form buttons
                const buttonDiv = document.createElement('div');
                buttonDiv.style.marginTop = '16px';
                buttonDiv.style.display = 'flex';
                buttonDiv.style.justifyContent = 'space-between';
                
                // Open file button
                const openFileBtn = document.createElement('button');
                openFileBtn.type = 'button';
                openFileBtn.textContent = 'Open File';
                openFileBtn.style.padding = '8px 16px';
                openFileBtn.addEventListener('click', () => {
                  if (filePath) {
                    vscode.postMessage({
                      command: 'openFile',
                      path: filePath
                    });
                  }
                  modal.remove();
                });
                
                const actionBtns = document.createElement('div');
                
                // Cancel button
                const cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.textContent = 'Cancel';
                cancelBtn.style.padding = '8px 16px';
                cancelBtn.style.marginRight = '8px';
                cancelBtn.addEventListener('click', () => {
                  modal.remove();
                });
                
                // Save button
                const saveBtn = document.createElement('button');
                saveBtn.type = 'submit';
                saveBtn.textContent = 'Save';
                saveBtn.style.padding = '8px 16px';
                saveBtn.style.backgroundColor = 'var(--highlight-color)';
                
                actionBtns.appendChild(cancelBtn);
                actionBtns.appendChild(saveBtn);
                
                buttonDiv.appendChild(openFileBtn);
                buttonDiv.appendChild(actionBtns);
                form.appendChild(buttonDiv);
                
                // Add form submission handler
                form.addEventListener('submit', (e) => {
                  e.preventDefault();
                  
                  // Get updated values from form
                  const formData = new FormData(e.target);
                  const updatedData = { ...values };
                  
                  // Update with form values
                  editableFields.forEach(field => {
                    updatedData[field.name] = formData.get(field.name);
                  });
                  
                  // Send update message
                  vscode.postMessage({
                    command: 'editItem',
                    recordId: recordId,
                    recordData: updatedData
                  });
                  
                  // Remove the modal - the view will refresh when update is confirmed
                  modal.remove();
                });
                
                modal.appendChild(form);
                return modal;
              }
              
              // Calendar dynamic filter builder functionality 
              const calendarFilterBuilder = document.getElementById('calendarFilterBuilder');
              const calendarAddFilterBtn = document.getElementById('calendarAddFilterBtn');
              const calendarSaveFilterBtn = document.getElementById('calendarSaveFilterBtn');
              const calendarSavedFiltersList = document.getElementById('calendarSavedFiltersList');
              const calendarSavedFiltersContainer = document.getElementById('calendarSavedFilters');
              const calendarShowFiltersBtn = document.getElementById('calendarShowFiltersBtn');
              const calendarFilterPanel = document.getElementById('calendarFilterPanel');
              const calendarClearFilterBtn = document.getElementById('calendarClearFilterBtn');
              const calendarApplyFiltersBtn = document.getElementById('calendarApplyFiltersBtn');
              
              // Show/hide filter panel
              if (calendarShowFiltersBtn && calendarFilterPanel) {
                calendarShowFiltersBtn.addEventListener('click', () => {
                  const isDisplayed = calendarFilterPanel.style.display !== 'none';
                  calendarFilterPanel.style.display = isDisplayed ? 'none' : 'block';
                  calendarShowFiltersBtn.textContent = isDisplayed ? 'Show Filters' : 'Hide Filters';
                });
              }
              
              if (calendarFilterBuilder && calendarAddFilterBtn) {
                // Function to create a new filter condition element (similar to the table view function)
                function createCalendarFilterCondition(isFirstCondition = false) {
                  const conditionId = 'calendar-filter-' + Date.now();
                  const condition = document.createElement('div');
                  condition.className = 'filter-condition';
                  condition.id = conditionId;
                  
                  // Logical join operator (AND/OR) for conditions after the first one
                  if (!isFirstCondition) {
                    const joinSelect = document.createElement('select');
                    joinSelect.className = 'filter-join';
                    
                    const andOption = document.createElement('option');
                    andOption.value = 'and';
                    andOption.textContent = 'AND';
                    andOption.selected = true;
                    
                    const orOption = document.createElement('option');
                    orOption.value = 'or';
                    orOption.textContent = 'OR';
                    
                    joinSelect.appendChild(andOption);
                    joinSelect.appendChild(orOption);
                    condition.appendChild(joinSelect);
                  }
                  
                  // Property selector
                  const propertySelect = document.createElement('select');
                  propertySelect.className = 'filter-property';
                  
                  // Add default empty option
                  const defaultOption = document.createElement('option');
                  defaultOption.value = '';
                  defaultOption.textContent = 'Select property...';
                  propertySelect.appendChild(defaultOption);
                  
                  // Add options for each field in the dataframe
                  dataframe.fields.forEach(field => {
                    const option = document.createElement('option');
                    option.value = field.name;
                    option.textContent = field.name;
                    propertySelect.appendChild(option);
                  });
                  
                  // Operator selector
                  const operatorSelect = document.createElement('select');
                  operatorSelect.className = 'filter-operator';
                  
                  const operators = [
                    { value: 'isNotEmpty', text: 'is not empty' },
                    { value: 'isEmpty', text: 'is empty' },
                    { value: 'is', text: 'is' },
                    { value: 'isNot', text: 'is not' },
                    { value: 'contains', text: 'contains' },
                    { value: 'doesNotContain', text: 'does not contain' }
                  ];
                  
                  operators.forEach(op => {
                    const option = document.createElement('option');
                    option.value = op.value;
                    option.textContent = op.text;
                    operatorSelect.appendChild(option);
                  });
                  
                  // Value input
                  const valueInput = document.createElement('input');
                  valueInput.type = 'text';
                  valueInput.className = 'filter-value';
                  valueInput.placeholder = 'Value...';
                  
                  // Remove button
                  const removeBtn = document.createElement('button');
                  removeBtn.type = 'button';
                  removeBtn.className = 'filter-remove';
                  removeBtn.textContent = '×';
                  removeBtn.title = 'Remove condition';
                  removeBtn.addEventListener('click', () => {
                    condition.remove();
                  });
                  
                  // Add elements to condition
                  condition.appendChild(propertySelect);
                  condition.appendChild(operatorSelect);
                  condition.appendChild(valueInput);
                  condition.appendChild(removeBtn);
                  
                  // Handle operator change to show/hide value input
                  operatorSelect.addEventListener('change', () => {
                    const operator = operatorSelect.value;
                    if (operator === 'isEmpty' || operator === 'isNotEmpty') {
                      valueInput.style.display = 'none';
                      valueInput.value = '';
                    } else {
                      valueInput.style.display = 'block';
                    }
                  });
                  
                  // Initialize with correct display state
                  if (operatorSelect.value === 'isEmpty' || operatorSelect.value === 'isNotEmpty') {
                    valueInput.style.display = 'none';
                  }
                  
                  return condition;
                }
                
                // Add a new condition when the "Add Condition" button is clicked
                calendarAddFilterBtn.addEventListener('click', () => {
                  const isFirstCondition = calendarFilterBuilder.children.length === 0;
                  const condition = createCalendarFilterCondition(isFirstCondition);
                  calendarFilterBuilder.appendChild(condition);
                });
                
                // Add an initial condition if the filter builder is empty
                if (calendarFilterBuilder.children.length === 0) {
                  calendarAddFilterBtn.click();
                }
                
                // Save filter functionality
                if (calendarSaveFilterBtn) {
                  calendarSaveFilterBtn.addEventListener('click', () => {
                    // Check if we have valid conditions to save
                    const conditions = [];
                    let hasValidConditions = false;
                    
                    calendarFilterPanel.querySelectorAll('.filter-condition').forEach(conditionEl => {
                      const propertySelect = conditionEl.querySelector('.filter-property');
                      const operatorSelect = conditionEl.querySelector('.filter-operator');
                      const valueInput = conditionEl.querySelector('.filter-value');
                      
                      if (propertySelect.value) {
                        hasValidConditions = true;
                        conditions.push({
                          property: propertySelect.value,
                          operator: operatorSelect.value,
                          value: valueInput.value
                        });
                      }
                    });
                    
                    if (!hasValidConditions) {
                      alert('Please add at least one valid filter condition');
                      return;
                    }
                    
                    // Prompt for filter name
                    const filterName = prompt('Enter a name for this filter:');
                    if (!filterName) return;
                    
                    // Save filter to localStorage with a different key for calendar
                    const viewKey = 'calendar_filters_' + dataframe.id;
                    let savedFilters = JSON.parse(localStorage.getItem(viewKey) || '[]');
                    
                    const filter = {
                      id: 'calendar_filter_' + Date.now(),
                      name: filterName,
                      conditions: conditions
                    };
                    
                    savedFilters.push(filter);
                    localStorage.setItem(viewKey, JSON.stringify(savedFilters));
                    
                    // Add to UI
                    addCalendarSavedFilterToUI(filter);
                  });
                }
                
                // Function to add a saved filter to the UI
                function addCalendarSavedFilterToUI(filter) {
                  if (!calendarSavedFiltersContainer || !calendarSavedFiltersList) return;
                  
                  // Show saved filters container if it was hidden
                  calendarSavedFiltersContainer.style.display = 'block';
                  
                  const filterItem = document.createElement('div');
                  filterItem.className = 'saved-filter';
                  filterItem.dataset.filterId = filter.id;
                  
                  const nameEl = document.createElement('div');
                  nameEl.className = 'saved-filter-name';
                  nameEl.textContent = filter.name;
                  
                  const actionsEl = document.createElement('div');
                  actionsEl.className = 'saved-filter-actions';
                  
                  const applyBtn = document.createElement('button');
                  applyBtn.className = 'filter-button';
                  applyBtn.textContent = 'Apply';
                  applyBtn.addEventListener('click', () => {
                    // Clear existing filter conditions
                    calendarFilterBuilder.innerHTML = '';
                    
                    // Add conditions from saved filter
                    filter.conditions.forEach(condition => {
                      const conditionEl = createCalendarFilterCondition();
                      
                      const propertySelect = conditionEl.querySelector('.filter-property');
                      const operatorSelect = conditionEl.querySelector('.filter-operator');
                      const valueInput = conditionEl.querySelector('.filter-value');
                      
                      propertySelect.value = condition.property;
                      operatorSelect.value = condition.operator;
                      valueInput.value = condition.value;
                      
                      // Update visibility of value input
                      if (condition.operator === 'isEmpty' || condition.operator === 'isNotEmpty') {
                        valueInput.style.display = 'none';
                      }
                      
                      calendarFilterBuilder.appendChild(conditionEl);
                    });
                    
                    // Apply the filter
                    calendarApplyFiltersBtn.click();
                  });
                  
                  const deleteBtn = document.createElement('button');
                  deleteBtn.className = 'filter-button';
                  deleteBtn.textContent = 'Delete';
                  deleteBtn.addEventListener('click', () => {
                    // Remove from UI
                    filterItem.remove();
                    
                    // Remove from localStorage
                    const viewKey = 'calendar_filters_' + dataframe.id;
                    let savedFilters = JSON.parse(localStorage.getItem(viewKey) || '[]');
                    savedFilters = savedFilters.filter(f => f.id !== filter.id);
                    localStorage.setItem(viewKey, JSON.stringify(savedFilters));
                    
                    // Hide container if no saved filters left
                    if (savedFilters.length === 0) {
                      calendarSavedFiltersContainer.style.display = 'none';
                    }
                  });
                  
                  actionsEl.appendChild(applyBtn);
                  actionsEl.appendChild(deleteBtn);
                  
                  filterItem.appendChild(nameEl);
                  filterItem.appendChild(actionsEl);
                  
                  calendarSavedFiltersList.appendChild(filterItem);
                }
                
                // Load saved filters on page load
                const calendarViewKey = 'calendar_filters_' + dataframe.id;
                const calendarSavedFilters = JSON.parse(localStorage.getItem(calendarViewKey) || '[]');
                
                if (calendarSavedFilters.length > 0 && calendarSavedFiltersContainer && calendarSavedFiltersList) {
                  calendarSavedFiltersContainer.style.display = 'block';
                  calendarSavedFilters.forEach(filter => {
                    addCalendarSavedFilterToUI(filter);
                  });
                }
              }
              
              // Apply calendar filters
              if (calendarApplyFiltersBtn) {
                calendarApplyFiltersBtn.addEventListener('click', () => {
                  // Get filters from the calendar filter builder
                  const filterConditions = [];
                  
                  // Get filters from the dynamic filter builder
                  calendarFilterPanel.querySelectorAll('.filter-condition').forEach((conditionEl, index) => {
                    const propertySelect = conditionEl.querySelector('.filter-property');
                    const operatorSelect = conditionEl.querySelector('.filter-operator');
                    const valueInput = conditionEl.querySelector('.filter-value');
                    const joinSelect = conditionEl.querySelector('.filter-join');
                    
                    if (propertySelect.value) {
                      const property = propertySelect.value;
                      const operator = operatorSelect.value;
                      const value = valueInput.value;
                      // Get the logical join (AND/OR) if not the first condition
                      const join = index > 0 && joinSelect ? joinSelect.value : null;
                      
                      // Always include isEmpty/isNotEmpty operators even without value
                      if (value || operator === 'isEmpty' || operator === 'isNotEmpty') {
                        filterConditions.push({ 
                          field: property, 
                          operator, 
                          value,
                          join 
                        });
                      }
                    }
                  });
                  
                  // Store the filter conditions in the DOM for reference
                  if (calendarFilterPanel) {
                    calendarFilterPanel.dataset.appliedFilters = JSON.stringify(filterConditions);
                  }
                  
                  // For calendar view, we need to refresh the data to apply the filters
                  // In a more sophisticated implementation, we would filter client-side
                  vscode.postMessage({
                    command: 'refreshData'
                  });
                });
              }
              
              // Clear calendar filters
              if (calendarClearFilterBtn) {
                calendarClearFilterBtn.addEventListener('click', () => {
                  // Clear all filter conditions
                  if (calendarFilterBuilder) {
                    calendarFilterBuilder.innerHTML = '';
                  }
                  
                  // Add a blank filter condition
                  if (calendarAddFilterBtn) {
                    calendarAddFilterBtn.click();
                  }
                  
                  // Refresh the view
                  vscode.postMessage({
                    command: 'refreshData'
                  });
                });
              }
              
              // Close event details modal
              if (closeEventDetailsBtn && eventDetails) {
                closeEventDetailsBtn.addEventListener('click', () => {
                  eventDetails.style.display = 'none';
                });
              }
            }
            
            // Add event listener to show/hide value input based on operator
            document.querySelectorAll('.filter-operator').forEach(selectEl => {
              // Initial setup - hide value inputs for operators that don't need them
              const operator = selectEl.value;
              const valueInput = selectEl.closest('.filter-field-inputs').querySelector('.filter-value');
              if (operator === 'isEmpty' || operator === 'isNotEmpty') {
                valueInput.style.display = 'none';
              } else {
                valueInput.style.display = 'block';
              }
              
              // Handle change events
              selectEl.addEventListener('change', () => {
                const operator = selectEl.value;
                const valueInput = selectEl.closest('.filter-field-inputs').querySelector('.filter-value');
                
                if (operator === 'isEmpty' || operator === 'isNotEmpty') {
                  valueInput.style.display = 'none';
                  valueInput.value = ''; // Clear the value since it's not needed
                } else {
                  valueInput.style.display = 'block';
                }
              });
            });
            
            const vscode = acquireVsCodeApi();
          })();
        </script>
      </body>
      </html>`;
  }
  
  /**
   * Renders a table view of the data
   */
  private renderTableView(dataframe: DataFrame): string {
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
    
    // Add filter bar
    let tableHtml = `
    <div class="container">
      <div class="filter-bar">
        <div class="filter-controls">
          <input type="text" id="searchInput" placeholder="Search..." class="search-box">
          <button id="clearFilterBtn" class="filter-button">Clear Filters</button>
          <button id="showFiltersBtn" class="filter-button">Show Filters</button>
        </div>
        <div id="filterPanel" class="filter-panel" style="display: none;">
          <h3>Filters</h3>
          
          <div id="filterBuilder" class="filter-builder">
            <!-- Dynamic filter conditions will be added here -->
          </div>
          
          <button id="addFilterBtn" class="filter-add">+ Add Condition</button>
          
          <div class="filter-actions">
            <div>
              <button id="saveFilterBtn" class="filter-button">Save Filter</button>
            </div>
            <div>
              <button id="applyFiltersBtn" class="filter-button">Apply Filters</button>
            </div>
          </div>
          
          <div id="savedFilters" class="filter-saved" style="display: none;">
            <h3>Saved Filters</h3>
            <div id="savedFiltersList">
              <!-- Saved filters will be displayed here -->
            </div>
          </div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            ${visibleFields.map(field => `
              <th>
                <div class="th-content">
                  <span>${field.name}</span>
                  <div class="sort-controls">
                    <span class="sort-control sort-asc" data-field="${field.name}" title="Sort ascending">↑</span>
                    <span class="sort-control sort-desc" data-field="${field.name}" title="Sort descending">↓</span>
                  </div>
                </div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
        ${dataframe.records.map(record => `
          <tr>
            ${visibleFields.map(field => {
              const value = record.values[field.name];
              
              // For file paths, make them clickable
              if (field.name === 'path' && typeof value === 'string') {
                return `<td>
                  <span class="file-link" data-path="${value}">${path.basename(value)}</span>
                </td>`;
              } else {
                // Format different data types appropriately
                let displayValue = '';
                
                if (value === null || value === undefined) {
                  displayValue = '';
                } else if (value instanceof Date) {
                  displayValue = value.toLocaleDateString();
                } else if (Array.isArray(value)) {
                  displayValue = value.filter(v => v !== null && v !== undefined).join(', ');
                } else {
                  displayValue = String(value);
                }
                
                return `<td>${displayValue}</td>`;
              }
            }).join('')}
          </tr>
        `).join('')}
        </tbody>
      </table>
    </div>`;
    
    return tableHtml;
  }
  
  /**
   * Renders a board view of the data
   */
  private renderBoardView(dataframe: DataFrame, view: ViewDefinition): string {
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
    const statusField = view.config?.groupByField || 'status';
    
    // Group records by the status field
    const groups = new Map<string, Array<any>>();
    
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
        } else if (record.values.title !== undefined) {
          title = String(record.values.title);
        } else {
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
  private renderCalendarView(dataframe: DataFrame, view: ViewDefinition): string {
    if (dataframe.records.length === 0) {
      return `<div class="container">
        <div class="card">
          <h2>No data</h2>
          <p>This project has no data records.</p>
        </div>
      </div>`;
    }
    
    // Get current date for reference
    const today = new Date();
    
    // Determine which date field to use for the calendar
    const dateField = view.config?.dateField || this.findSuitableDateField(dataframe.fields);
    
    // Use saved year and month from config if available, otherwise use current date
    const currentYear = view.config?.year || today.getFullYear();
    const currentMonth = view.config?.month !== undefined ? view.config.month : today.getMonth();
    
    // Get first day of the month and last day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Get the starting day of the week (0 = Sunday, 1 = Monday, etc.)
    const startingDay = firstDayOfMonth.getDay();
    
    // Generate the calendar grid
    let calendarHtml = `
    <div class="container">
      <div class="calendar-container">
        <div class="calendar-toolbar">
          <button id="prevMonth">←</button>
          <h2 id="currentMonthDisplay">${firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <button id="nextMonth">→</button>
          <button id="todayBtn">Today</button>
        </div>
        
        <div class="calendar-filter">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div>
              <label>Date field: 
                <select id="dateFieldSelect">
                  ${this.findDateFields(dataframe.fields).map(field => 
                    `<option value="${field.name}" ${field.name === dateField ? 'selected' : ''}>${field.name}</option>`
                  ).join('')}
                </select>
              </label>
            </div>
            <div>
              <button id="calendarShowFiltersBtn" class="filter-button">Show Filters</button>
            </div>
          </div>
          
          <div id="calendarFilterPanel" class="filter-panel" style="display: none;">
            <h3>Filters</h3>
            
            <div id="calendarFilterBuilder" class="filter-builder">
              <!-- Dynamic filter conditions will be added here -->
            </div>
            
            <button id="calendarAddFilterBtn" class="filter-add">+ Add Condition</button>
            
            <div class="filter-actions">
              <div>
                <button id="calendarSaveFilterBtn" class="filter-button">Save Filter</button>
              </div>
              <div>
                <button id="calendarApplyFiltersBtn" class="filter-button">Apply Filters</button>
                <button id="calendarClearFilterBtn" class="filter-button">Clear</button>
              </div>
            </div>
            
            <div id="calendarSavedFilters" class="filter-saved" style="display: none;">
              <h3>Saved Filters</h3>
              <div id="calendarSavedFiltersList">
                <!-- Saved filters will be displayed here -->
              </div>
            </div>
          </div>
        </div>
        
        <div class="calendar-grid">
          <div class="calendar-header">
            <div class="calendar-cell">Sun</div>
            <div class="calendar-cell">Mon</div>
            <div class="calendar-cell">Tue</div>
            <div class="calendar-cell">Wed</div>
            <div class="calendar-cell">Thu</div>
            <div class="calendar-cell">Fri</div>
            <div class="calendar-cell">Sat</div>
          </div>
          
          <div class="calendar-body">`;
    
    // Group records by date
    const recordsByDate = new Map<string, Array<any>>();
    
    dataframe.records.forEach(record => {
      // Get the date value from the record
      let dateValue = record.values[dateField];
      
      // Skip records with no date value
      if (dateValue === null || dateValue === undefined) {
        return;
      }
      
      // Convert the date value to a Date object
      let date: Date;
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        // Try to parse the date string
        date = new Date(dateValue);
        if (isNaN(date.getTime())) {
          return; // Invalid date
        }
      } else if (typeof dateValue === 'number') {
        // Assume timestamp
        date = new Date(dateValue);
      } else {
        return; // Unsupported date format
      }
      
      // Format the date to YYYY-MM-DD for grouping
      const dateKey = date.toISOString().split('T')[0];
      
      if (!recordsByDate.has(dateKey)) {
        recordsByDate.set(dateKey, []);
      }
      
      const recordsForDate = recordsByDate.get(dateKey);
      if (recordsForDate) {
        recordsForDate.push(record);
      }
    });
    
    // Create calendar cells
    let day = 1;
    const totalDays = lastDayOfMonth.getDate();
    
    // Create rows for the calendar
    for (let i = 0; i < 6; i++) { // Maximum 6 weeks in a month view
      calendarHtml += `<div class="calendar-row">`;
      
      // Create 7 cells for each day of the week
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < startingDay) || day > totalDays) {
          // Empty cell
          calendarHtml += `<div class="calendar-cell empty"></div>`;
        } else {
          // Format the date for this cell
          const cellDate = new Date(currentYear, currentMonth, day);
          const dateKey = cellDate.toISOString().split('T')[0];
          
          // Check if there are records for this date
          const recordsForDate = recordsByDate.get(dateKey) || [];
          const isToday = day === today.getDate() && 
                         currentMonth === today.getMonth() && 
                         currentYear === today.getFullYear();
          
          calendarHtml += `
            <div class="calendar-cell ${isToday ? 'today' : ''}" data-date="${dateKey}">
              <div class="calendar-date">${day}</div>
              <div class="calendar-events">`;
          
          // Add up to 3 events for this date, with a "+X more" indicator if more exist
          if (recordsForDate.length > 0) {
            // Sort records by some criteria (e.g., name or priority)
            recordsForDate.sort((a, b) => {
              const aName = a.values.name || a.values.title || a.id;
              const bName = b.values.name || b.values.title || b.id;
              return String(aName).localeCompare(String(bName));
            });
            
            // Display limited number of events
            const displayLimit = 3;
            const displayEvents = recordsForDate.slice(0, displayLimit);
            
            displayEvents.forEach(record => {
              const name = record.values.name || record.values.title || record.id;
              const filePath = record.values.path || '';
              
              calendarHtml += `
                <div class="calendar-event" data-record-id="${record.id}" data-path="${filePath}">
                  <span title="${name}">${name}</span>
                </div>`;
            });
            
            // If there are more events than the display limit, show a count
            if (recordsForDate.length > displayLimit) {
              const moreCount = recordsForDate.length - displayLimit;
              calendarHtml += `<div class="more-events">+${moreCount} more</div>`;
            }
          }
          
          calendarHtml += `</div></div>`;
          day++;
        }
      }
      
      calendarHtml += `</div>`;
      
      // If we've displayed all days of the month, exit the loop
      if (day > totalDays) {
        break;
      }
    }
    
    calendarHtml += `
          </div>
        </div>
        
        <div class="event-details" id="eventDetails" style="display: none;">
          <div class="event-details-header">
            <h3>Events for <span id="selectedDate"></span></h3>
            <button id="closeEventDetails">✕</button>
          </div>
          <div id="eventDetailsList"></div>
        </div>
      </div>
    </div>`;
    
    return calendarHtml;
  }
  
  /**
   * Renders a gallery view of the data
   */
  private renderGalleryView(dataframe: DataFrame): string {
    if (dataframe.records.length === 0) {
      return `<div class="container">
        <div class="card">
          <h2>No data</h2>
          <p>This project has no data records.</p>
        </div>
      </div>`;
    }
    
    let galleryHtml = `<div class="container">
      <h2>Gallery View</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;">`;
    
    dataframe.records.forEach(record => {
      let title = '';
      if (record.values.name !== undefined) {
        title = String(record.values.name);
      } else if (record.values.title !== undefined) {
        title = String(record.values.title);
      } else {
        title = record.id;
      }
      
      const description = record.values.description !== undefined ? String(record.values.description) : '';
      const filePath = record.values.path !== undefined ? String(record.values.path) : '';
      
      galleryHtml += `
        <div class="card" style="height: 200px; overflow: hidden;">
          <h3><span class="file-link" data-path="${filePath}">${title}</span></h3>
          <p>${description}</p>
        </div>`;
    });
    
    galleryHtml += `</div></div>`;
    return galleryHtml;
  }
}
