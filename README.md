# Obsidian Projects

[![Build Obsidian plugin](https://github.com/marcusolsson/obsidian-projects/actions/workflows/ci.yml/badge.svg)](https://github.com/marcusolsson/obsidian-projects/actions/workflows/ci.yml)
[![Release Obsidian plugin](https://github.com/marcusolsson/obsidian-projects/actions/workflows/release.yml/badge.svg)](https://github.com/marcusolsson/obsidian-projects/actions/workflows/release.yml)
![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22obsidian-projects%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)
[![Buy me a coffee](https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/marcusolsson)
[![Maintenance Status](https://img.shields.io/badge/maintenance-status-brightgreen)](https://github.com/marcusolsson/obsidian-projects/issues/158)

Obsidian Projects is a plugin for [Obsidian](https://obsidian.md) that lets you manage and visualize notes for project management.

- Create projects from folders and Dataview queries.
- Switch between four different views: _Table_, _Board_, _Calendar_, and _Gallery_.
- Configure note templates for each project.

For example, if you're a content manager, Projects can help you manage your content calendar. Create drafts, keep track of their status, and when they are scheduled to be published.

If you'd like to see Projects in action, check out any of these amazing walkthroughs made by users:

- [Notion-like content calendar in Obsidian](https://www.youtube.com/watch?v=ny8lksaQ5A8)
- [Notion database views in Obsidian Projects plugin](https://www.youtube.com/watch?v=LdaMe2rzAW8) (interview)
- [Visualiza la base de datos como en Notion dentro de Obsidian](https://www.youtube.com/watch?v=vReObPVS2oo)
- [Obsidian Projects: How to Manage Your Note-based Projects in Obsidian](https://www.youtube.com/watch?v=9d9ibSC1TXU)

_Did I miss any? Let me know and I'll add them to the list!_

## Data sources

Projects uses _data sources_ to query the notes to include in your project.

Data sources try to detect the type of each property in your notes, such as numbers or lists. If the data source detects multiple data types for a property, it falls back to use a text field.

### Front matter

Collects note data from the [YAML front matter](https://help.obsidian.md/Advanced+topics/YAML+front+matter) in your notes. This is the default data source.

### Dataview

Collects note data from using a Dataview query. Dataview projects are _read-only_, meaning you can't edit the data from any the views.

To use the Dataview data source in your project:

1. Under Obsidian **Settings > Community plugins**, install and enable the Dataview plugin.
1. Create a new project, or edit an existing project.
1. In the project settings, select **Use Dataview**.
1. In **Query**, enter a Dataview [TABLE query](https://blacksmithgu.github.io/obsidian-dataview/query/queries/#table-queries).
1. Select **Save**.

## Philosophy

Design decisions are guided by the following principles:

- **Leave no trace:** The plugin must not leave any plugin-specific configuration in the notes, such as custom front matter properties. Notes may be shared with colleagues and teams who don't use Obsidian. If the user stops using this plugin, they shouldn't have to clean up all their notes.
- **Keep it native:** The plugin should look and feel like it's native to Obsidian. The plugin should also prefer native Web APIs over custom components whenever possible.
- **Stability over features:** This plugin is geared towards professionals with high demands on reliability. Any bug reports and usability issues will be prioritized over new features.

## Contribute

Check out the [roadmap](https://github.com/users/marcusolsson/projects/4/views/14) to see what's being worked on at the moment.

Help me prioritize work by adding a :+1: reaction to issues that are important to you ([see the most requested issues](https://github.com/marcusolsson/obsidian-projects/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc)).

For other ideas on how you can contribute, check the label on the issue:

| Label                             | Valid for      | Description                                                                                               | Contribute                                                                    |
| --------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `needs-triage`                    | `kind/*`       | I've seen the issue, but haven't had a chance to look into it.                                            |
| `triage/needs-information`        | `kind/*`       | Issue lacks necessary information for me to make an informed decision.                                    | Share information about the issue or request.                                 |
| `triage/not-reproducible`         | `kind/bug`     | Bugs that I haven't been able to confirm on my side.                                                      | Share clues or steps to reproduce the bug.                                    |
| `triage/accepted`                 | `kind/*`       | Issue has been confirmed and receives a `priority/*` label.                                               |
| `needs-design`                    | `kind/feature` | Issue needs design work before it can be worked on.                                                       | Share insights into how you'd like the feature to work.                       |
| `priority/awaiting-more-evidence` | `kind/feature` | Issue is potentially useful, but needs more support from the community before it's ready to be worked on. | Add reaction to the issue, or explain how the feature would be useful to you. |
| `priority/backlog`                | `kind/feature` | Issue is ready to be worked on.                                                                           | Add a comment in the issue if you'd like to work on it.                       |
| `priority/critical`               | `kind/bug`     | Issue needs fixing before anything else.                                                                  | Have patience while I'm working on it :heart:                                 |
