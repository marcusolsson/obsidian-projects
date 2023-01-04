# Obsidian Projects

[![Build Obsidian plugin](https://github.com/marcusolsson/obsidian-projects/actions/workflows/ci.yml/badge.svg)](https://github.com/marcusolsson/obsidian-projects/actions/workflows/ci.yml)
[![Release Obsidian plugin](https://github.com/marcusolsson/obsidian-projects/actions/workflows/release.yml/badge.svg)](https://github.com/marcusolsson/obsidian-projects/actions/workflows/release.yml)
![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22obsidian-projects%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)
[![Buy me a coffee](https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/marcusolsson)
[![Maintenance Status](https://img.shields.io/badge/maintenance-status-brightgreen)](https://github.com/marcusolsson/obsidian-projects/discussions)

Obsidian Projects is a plugin for [Obsidian](https://obsidian.md) that lets you manage and visualize notes for project management.

- Create projects from folders and Dataview queries.
- Switch between four different views: _Table_, _Board_, _Calendar_, and _Gallery_.
- Configure note templates for each project.

For example, if you're a content manager, Projects can help you manage your content calendar. Create drafts, keep track of their status, and when they are scheduled to be published.

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

## Troubleshooting

This section lists common questions on how to use Obsidian Projects.

### Why doesn't Projects detect my date fields?

Projects only supports [ISO 8601](https://wikipedia.org/wiki/ISO_8601) date strings.

For example:

```md
---
date: 2006-01-28
---

# Weekly planning
```

### Why are some values missing?

Projects tries to detect the field type based on the values from the notes in the project. If multiple field types are detected, for example `23` (number) and `false` (boolean), the plugin needs to guess the type and parse the remaining values as that type.

At the moment, depending on the type some values can't be parsed. For example, how do you parse an array as a boolean? I'm planning to [display parsing errors](https://github.com/marcusolsson/obsidian-projects/issues/71) in a better way.

Until then, make sure that the values for the field have the same format, to make it easier to detect the field type.

### What about mobile support?

I enabled the plugin to be installed on mobile devices in [#161](https://github.com/marcusolsson/obsidian-projects/issues/161). Unfortunately, it became clear the plugin needs more work in order to run well in the mobile app. Debugging plugins for Obsidian mobile is rather difficult at the moment, as you can only really test it by making a public release. 

Rather than causing frustration while trying to enable the plugin, I've officially disabled mobile support for now. Let me know if you're interested in working on this.

## Learn more

If you'd like to see Projects in action, check out any of these amazing resources made by users.

### Videos

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
