# VSCode Projects

A project management and visualization extension for VSCode, inspired by the Obsidian Projects plugin.

## Features

- Create projects from folders, tags, or custom queries
- Switch between different views: Table, Board, Calendar, and Gallery
- Configure file templates for each project
- Organize and visualize your files for better project management

## Installation

Since this is a local development project, follow these instructions to run it:

1. Make sure you have [Node.js](https://nodejs.org/) and npm installed
2. Install required dependencies:
   ```
   npm install
   ```
3. Compile the extension:
   ```
   npm run compile
   ```
4. Press F5 to open a new window with the extension loaded

## Requirements

- Visual Studio Code v1.60.0 or higher
- Node.js and npm (for development)

## Extension Settings

This extension contributes the following settings:

* `vscode-projects.projects`: Configured projects
* `vscode-projects.archives`: Archived projects
* `vscode-projects.preferences`: User preferences for the extension

## Usage

1. Click on the Projects icon in the activity bar
2. Use the "Create Project" command to create a new project
3. Select a folder to include in your project
4. Use the different views to visualize and organize your project files

## Views

- **Table View**: Display your files in a table layout with sortable columns
- **Board View**: Kanban-style board for visual task management
- **Calendar View**: Calendar visualization to track deadlines and schedules
- **Gallery View**: Visual gallery of your files

## Cross-Platform Support

This extension is designed to work on Windows, macOS, and Linux platforms.

## Development

This extension uses the following technologies:
- TypeScript for type-safe code
- VSCode Extension API
- File System API for cross-platform file access

## License

Apache License 2.0
