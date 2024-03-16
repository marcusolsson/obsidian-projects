# Contribute to Projects

Thank you for considering contributing to Projects! On this page, you'll learn how you can help make Projects even better!

## Voting for features

Since the release of Projects, users have requested more features than we have resources to implement. Your voice matters, and we need your help understand what's most important.

Help prioritize work by adding a :+1: reaction to issues that are important to you ([see the most requested issues](https://github.com/marcusolsson/obsidian-projects/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc)).

To see what's being working on, check out the [roadmap](https://github.com/users/marcusolsson/projects/4/views/14).

## Testing

Help find bugs and unexpected behavior when using the plugin. Help me find sources of annoyance and frustration before others do. Even reporting small things like losing focus, or a glitchy UI, help improve the overall quality of the plugin. No issues are too small to reports.

## Submitting a pull request

You can work on any issue with the `lifecycle/backlog` label. Before you start working, please announce that you want to do so by commenting on the issue. I'll add the `lifecycle/active` label to let others know that it's being actively worked on by someone.

## Translations

[![inlang status badge](https://badge.inlang.com/?url=github.com/marcusolsson/obsidian-projects)](https://fink.inlang.com/github.com/marcusolsson/obsidian-projects)

Help make the Projects display text available in your language!

If you’re interested in adding a new translation, here’s how you can do it:

1. Navigate to `src/lib/stores/i18n.ts.`
2. Register your language code in the `resources` field.
3. Create a corresponding `.json` file in the `src/lib/stores/translations` directory.

Once the language is already registered, you can contribute in either way:

- Directly push the updated `.json` resource.
- Use the `inlang` platform for a more user-friendly interface by clicking the badge above.

## Triaging issues

You can contribute by helping an issue move forward. Depending on the labels on the issue, you can help in different ways:

- Vote for issues that are important to you.
- Help figuring out how to reproduce bugs.
- Provide support for ideas by sharing your use case.
- Find issues that are duplicates of already existing issues.

## Understanding labels

Projects uses labels for issues to organize work. This section lists all the labels used by the project and what they mean.

### Kind

`kind/*` describes the type of issue. All issues **must** have a `kind/*` label.

| Label | Description |
| ----- | ----------- |
| `kind/bug` | Something isn't working. |
| `kind/feature` | New feature request. |
| `kind/documentation` | Improvements or additions to documentation. |
| `kind/cleanup` | Cleaning up code, configuration, or technical debt. |
| `kind/epic` | Issues that contain other issues and design discussions for big changes. |
| `kind/support` | (Deprecated) Use [Discussions](https://github.com/marcusolsson/obsidian-projects/discussions/categories/help) for support questions. |

### Triage

When a user creates an issue, it needs to be reviewed, or _triaged_, to be able to label it correctly.

`triage/*` describes the triage status for an issue.

| Label | Description |
| ----- | ----------- |
| `triage/confirmed` | Issue is well-defined and understood. Needs to have a `priority/*` label. |
| `triage/duplicate` | Issue is a duplicate of another issue. |
| `triage/needs-information` | Issue needs more information in order to work on it. |
| `triage/needs-investigation` | Issue needs investigation before it can be confirmed. |
| `triage/not-reproducible` | Issue can't be reproduced as described. |

### Lifecycle

`lifecycle/*` describes how close the issue is from being resolved.

| Label | Description |
| ----- | ----------- |
| `lifecycle/idea` | Possibly useful, but not yet enough support to actually get it done. |
| `lifecycle/backlog` | Issues that are ready to be worked on. |
| `lifecycle/active` | Issues is actively being worked on. |
| `lifecycle/stale` | Issues hasn't seen any activity for 60 days. |
| `lifecycle/rotten` | Issues hasn't seen any activity for 30 days after being marked as stale. |
| `lifecycle/frozen` | Frozen issues can't become stale or rotten. |

### Priority

`priority/*` describes how important the issue is. Higher priority means the issue is more likely to be fixed.

| Label | Description |
| ----- | ----------- |
| `priority/critical` | Must be must be worked on before anything else. |

### Area

`area/*` describes what part of the plugin the issue relates to.

| Label | Description |
| ----- | ----------- |
| `area/core` | Issues related to the core platform. |
| `area/views` | Issues related to views in general, or for new views.|
| `area/view/*` | Issues related to a specific view, for example `area/view/table`. |
| `area/datasources` | Issues related to data sources in general, or for new data sources.|
| `area/datasource/*` | Issues related to a specific data source, for example `area/datasource/dataview`. |
| `area/integrations` | Issues related to integrating other tools and plugins with Projects. |

### Operating system

`os/*` gets added to issues related to a specific operating system.

| Label | Description |
| ----- | ----------- |
| `os/android` | Issues related to Android devices. |
| `os/ios` | Issues related to iOS devices. |
| `os/macos` | Issues related to macOS. |
| `os/windows` | Issues related to Windows. .|
| `os/linux` | Issues related to Linux. |

### Miscellanous

Various labels that don't fit in anywhere else.

| Label | Description |
| ----- | ----------- |
| `good first issue` | Issues suitable for first-time contributors. |
| `help wanted` | Issues that are blocked due to lack of technology or expertise. |
| `ignore-for-release` | Used for pull requests to avoid listing them in the changelog. |

## Still have questions?

If this document didn't answer your questions on how to contribute to Projects, feel free to ask it in [Discussions](https://github.com/marcusolsson/obsidian-projects/discussions/new?category=help).
