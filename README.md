# Obsidian Projects

[![Build Obsidian plugin](https://github.com/marcusolsson/obsidian-projects/actions/workflows/release.yml/badge.svg)](https://github.com/marcusolsson/obsidian-projects/actions/workflows/release.yml)
[![Buy me a coffee](https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/marcusolsson)

Obsidian Projects is a plugin for [Obsidian](https://obsidian.md) that lets you manage and visualize notes for project management.

- Create folder-based projects.
- Switch between three different views: Table, Board, and Calendar.
- Configure note templates for each project.

For example, if you're a content manager, Project can help you manage your content calendar. Create drafts, keep track of their status, and when they are scheduled to be published.

> **Currently in beta:** This plugin is not yet published. To beta test it, you can use the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin.

## Data sources

Projects uses _data sources_ to query the notes to include in your project. By default, Projects uses the _front matter data source_.

Data sources try to detect the type of each property in your notes, such as numbers or lists. If the data source detects multiple data types for a property, it falls back to use a text field.

### Front matter

Collects note data from the [YAML front matter](https://help.obsidian.md/Advanced+topics/YAML+front+matter) in your notes.

### Dataview

Collects note data from using a Dataview query. Dataview projects are _read-only_, meaning you can't edit the data from any the views.

To use the Dataview data source in your project:

1. Under Obsidian **Settings > Community plugins**, install and enable the Dataview plugin.
1. Create a new project, or edit an existing project.
1. In the project settings, select **Use Dataview**.
1. In **Query**, enter a Dataview [TABLE query](https://blacksmithgu.github.io/obsidian-dataview/query/queries/#table-queries).
1. Select **Save**.

## Views

Obsidian Projects supports three types of views: _Table_, _Board_, and _Calendar_.

### Table

![Table](assets/table.png)

### Board

![Board](assets/board.png)

### Calendar

![Calendar](assets/calendar.png)
