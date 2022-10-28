# Obsidian Projects

[![Build Obsidian plugin](https://github.com/marcusolsson/obsidian-projects/actions/workflows/release.yml/badge.svg)](https://github.com/marcusolsson/obsidian-projects/actions/workflows/release.yml)
[![Buy me a coffee](https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/marcusolsson)

Obsidian Projects is a plugin for [Obsidian](https://obsidian.md) that lets you manage and visualize notes for project management.

- Create folder-based projects.
- Switch between four different views: _Table_, _Board_, _Calendar_, and _Gallery_.
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

## Philosophy

Design decisions are guided by the following principles:

- **Leave no trace:** The plugin must not leave any plugin-specific configuration in the notes, such as custom front matter properties. Notes may be shared with colleagues and teams who don't use Obsidian. If the user stops using this plugin, they shouldn't have to clean up all their notes.
- **Keep it native:** The plugin should look and feel like it's native to Obsidian. The plugin should also prefer native Web APIs over custom components whenever possible.\
- **Stability over features:** This plugin prioritizes bug reports and usability issues over working on new features.

## Contribute

Check out the [roadmap](https://github.com/users/marcusolsson/projects/4) to see what's being worked on at the moment.

- [Needs triage](https://github.com/users/marcusolsson/projects/4/views/6) lists issues I haven't looked into yet.
- [Bug hunt](https://github.com/users/marcusolsson/projects/4/views/5) lists open bug reports that have yet to be confirmed. Contribute by providing steps to reproduce the bug.
  - Issues with `triage/needs-information` lack necessary information for me to make an informed decision.
    - **Contribute by** adding a comment with more information about the issue or request.
  - Issues with `triage/not-reproducible` are set to bugs that I haven't been able to confirm yet.
    - **Contribute by** adding a comment with clues or steps to reproduce the bug.
- [Ready to work on](https://github.com/users/marcusolsson/projects/4/views/8) lists issues that have passed triage and are ready to be worked on. Every issue that has passed triage receives a `priority/*` label.
  - Issues with `priority/awaiting-more-evidence` are possibly useful, but needs more support before being worked on.
    - **Contribute by** adding a reaction to the issue, or by explaining how the feature would be useful to you.
  - Issues with `priority/backlog` are ready to be implemented. Add a comment in the issue if you'd like to work on it.
    - **Contribute by** submitting a pull request with an implementation.
  - Issues with `priority/critical` are issues that needs fixing before anything else.
    - **Contribute by** having patience while I'm working on it :heart:
- [Prioritized](https://github.com/users/marcusolsson/projects/4/views/11) lists issues that I'll actively work on when I find the time.
