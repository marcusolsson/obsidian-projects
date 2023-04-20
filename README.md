<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/marcusolsson/obsidian-projects/main/images/dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/marcusolsson/obsidian-projects/main/images/light.svg">
  <img alt="Projects logo" src="https://raw.githubusercontent.com/marcusolsson/obsidian-projects/main/images/light.svg">
</picture>

[![Build Obsidian plugin](https://github.com/marcusolsson/obsidian-projects/actions/workflows/ci.yml/badge.svg)](https://github.com/marcusolsson/obsidian-projects/actions/workflows/ci.yml)
[![Release Obsidian plugin](https://github.com/marcusolsson/obsidian-projects/actions/workflows/release.yml/badge.svg)](https://github.com/marcusolsson/obsidian-projects/actions/workflows/release.yml)
![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22obsidian-projects%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)
[![Buy me a coffee](https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/marcusolsson)
[![Maintenance Status](https://img.shields.io/badge/maintenance-status-brightgreen)](https://github.com/marcusolsson/obsidian-projects/discussions)

Projects is a plugin for [Obsidian](https://obsidian.md) that lets you manage and visualize notes for project management.

- Create projects from folders and Dataview queries.
- Switch between four different views: _Table_, _Board_, _Calendar_, and _Gallery_.
- Configure note templates for each project.

For example, if you're a content manager, Projects can help you manage your content calendar. Create drafts, keep track of their status, and when they are scheduled to be published.

If you have any questions, or want to stay updated, join our [Discussions](https://github.com/marcusolsson/obsidian-projects/discussions).

## Installation

> **Note**  
> You must turn off **Restricted mode** to use Projects.

1. In Obsidian, open **Settings**.
1. Under **Community plugins**, select **Browse**.
1. Search for "Projects" by Marcus Olsson, and then select it.
1. Select **Install**.

To get started using Projects, press **Ctrl+P** (or **Cmd+P** on macOS) to open the **Command palette**, and then select **Projects: Show projects**.

## Design Philosophy

When developing any software, you often faced with difficult choices. To help guide design decisions, this project adheres to the following principles:

- **Leave no trace:** The plugin must not leave any plugin-specific configuration in the notes, such as custom front matter properties. Notes may be shared with colleagues and teams who don't use Obsidian. If the user stops using this plugin, they shouldn't have to clean up all their notes.
- **Keep it native:** The plugin should look and feel like it's native to Obsidian. The plugin should also prefer native Web APIs over custom components whenever possible.
- **Stability over features:** This plugin is geared towards professionals with high demands on reliability. Any bug reports and usability issues will be prioritized over new features.

## Roadmap

If you're curious about what we're working on, check out the roadmap:

- [Active issues](https://github.com/marcusolsson/obsidian-projects/issues?q=is%3Aopen+is%3Aissue+sort%3Areactions-%2B1-desc+label%3Alifecycle%2Factive): Issues that are actively being worked on.
- [Prioritized backlog](https://github.com/marcusolsson/obsidian-projects/issues?q=is%3Aopen+is%3Aissue+label%3Apriority%2Fhigh+sort%3Areactions-%2B1-desc+): Issues we'll be working on next.
- [Backlog](https://github.com/marcusolsson/obsidian-projects/issues?q=is%3Aopen+is%3Aissue+label%3Alifecycle%2Fbacklog+sort%3Areactions-%2B1-desc): Issues anyone can start working on (please let us know before you do).
- [Ideas](https://github.com/marcusolsson/obsidian-projects/issues?q=is%3Aopen+is%3Aissue+label%3Alifecycle%2Fidea+sort%3Areactions-%2B1-desc): Promising issues that haven't made it to the backlog yet.

To vote for a feature, react to the issue with a :+1:.

- [Most requested issues](https://github.com/marcusolsson/obsidian-projects/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc) 

## Contribute

For more information on how to contribute to Projects, check out [CONTRIBUTE.md](https://github.com/marcusolsson/obsidian-projects/blob/main/CONTRIBUTING.md).

## Learn More

If you'd like to see Projects in action, check out any of these amazing resources made by users.

### Videos

- 2023-04-20: [You all NEED these Obsidian community plugins](https://www.youtube.com/watch?v=Yzi1o-BH6QQ&t=1022s)
- 2022-12-10: [Use Obsidian for Content Creation | Build Notion-like Database Views](https://www.youtube.com/watch?v=Ds-VPz7jIwM) by [@amyjuanli](https://www.youtube.com/@amyjuanli)
- 2022-12-06: [Créer un calendrier éditorial dans Obsidian : Le plugin Projects](https://www.youtube.com/watch?v=Wmx2EoQYrTI) by [@cerveaunumeriquefr](https://www.youtube.com/@cerveaunumeriquefr)
- 2022-11-23: [Obsidian For Content Creators](https://www.youtube.com/watch?v=jovUqLbqS1Y) by [@FromSergio](https://www.youtube.com/@FromSergio)
- 2022-11-18: [Notion-like content calendar in Obsidian](https://www.youtube.com/watch?v=ny8lksaQ5A8) by [@nicolevdh](https://www.youtube.com/@nicolevdh)
- 2022-11-13: [Obsidian Projects: How to Manage Your Note-based Projects in Obsidian](https://www.youtube.com/watch?v=9d9ibSC1TXU) by [@beingpax](https://www.youtube.com/@beingpax)
- 2022-11-07: [Notion database views in Obsidian Projects plugin](https://www.youtube.com/watch?v=LdaMe2rzAW8) by [@nicolevdh](https://www.youtube.com/@nicolevdh) (interview)
- 2022-11-07: [Visualiza la base de datos como en Notion dentro de Obsidian](https://www.youtube.com/watch?v=vReObPVS2oo) by [@SniferL4bs](https://www.youtube.com/@SniferL4bs)


### Articles

- [How to Set up and Maintain Your Academic Reading List in Obsidian](https://nataliekraneiss.com/your-academic-reading-list-in-obsidian/) by [Natalie Kraneiß](https://nataliekraneiss.com/)
- [Obsidian Projects: A Better Way to Manage Text-Based Projects in Obsidian](https://beingpax.medium.com/obsidian-projects-a-better-way-to-manage-text-based-projects-in-obsidian-18c2a991069c) by [Prakash Joshi Pax](https://beingpax.medium.com/)

_Did I miss any? Let me know and I'll add them to the list!_

## Support

If Projects has been useful to you, consider [buying me a book](https://www.buymeacoffee.com/marcusolsson) to show your support.

## License

Projects is distributed under [Apache License 2.0](LICENSE).
