import { describe, expect, it } from "@jest/globals";
import { resolve } from "./settings";
import type { ShowCommand } from "../settings";

describe("resolve v2", () => {
  it("resolves minimum", () => {
    const got = resolve({ version: 2 });

    expect(got).toStrictEqual({
      version: 2,
      projects: [],
      archives: [],
      preferences: {
        frontmatter: {
          quoteStrings: "PLAIN",
        },
        locale: {
          firstDayOfWeek: "default",
        },
        projectSizeLimit: 1000,
        commands: [],
        linkBehavior: "open-editor",
      },
    });
  });

  it("resolves an empty project with defaults", () => {
    const got = resolve({ version: 2, projects: [{ name: "Foo", id: "foo" }] });

    expect(got).toStrictEqual({
      version: 2,
      projects: [
        {
          name: "Foo",
          id: "foo",
          fieldConfig: {},
          defaultName: "",
          templates: [],
          excludedNotes: [],
          isDefault: false,
          dataSource: {
            kind: "folder",
            config: {
              path: "",
              recursive: false,
            },
          },
          newNotesFolder: "",
          views: [],
        },
      ],
      archives: [],
      preferences: {
        frontmatter: {
          quoteStrings: "PLAIN",
        },
        locale: {
          firstDayOfWeek: "default",
        },
        projectSizeLimit: 1000,
        commands: [],
        linkBehavior: "open-editor",
      },
    });
  });
});

describe("clean up commands", () => {
  it("uniquify commands and remove orphan ones", () => {
    const validCommands: ShowCommand[] = [
      { project: "sample-project" },
      { project: "sample-project", view: "project-view" },
      { project: "sample-archive" },
      { project: "sample-archive", view: "archive-view" },
    ];
    const invalidCommands: ShowCommand[] = [
      { project: "unknown-project" },
      { project: "sample-project", view: "unknown-view" },
      { project: "unknown-archive" },
      { project: "sample-archive", view: "unknown-view" },
    ];
    const duplicatedCommands: ShowCommand[] = [
      { project: "sample-project" },
      { project: "sample-archive", view: "archive-view" },
    ];

    const got = resolve({
      version: 2,
      projects: [
        {
          name: "Sample Project",
          id: "sample-project",
          fieldConfig: {},
          defaultName: "",
          templates: [],
          excludedNotes: [],
          isDefault: false,
          dataSource: {
            kind: "folder",
            config: {
              path: "",
              recursive: false,
            },
          },
          newNotesFolder: "",
          views: [
            {
              name: "Table",
              id: "project-view",
              type: "table",
              config: {},
              filter: { conditions: [] },
              colors: { conditions: [] },
              sort: { criteria: [] },
            },
          ],
        },
      ],
      archives: [
        {
          name: "Archived Project",
          id: "sample-archive",
          fieldConfig: {},
          defaultName: "",
          templates: [],
          excludedNotes: [],
          isDefault: false,
          dataSource: {
            kind: "folder",
            config: {
              path: "",
              recursive: false,
            },
          },
          newNotesFolder: "",
          views: [
            {
              name: "Table",
              id: "archive-view",
              type: "table",
              config: {},
              filter: { conditions: [] },
              colors: { conditions: [] },
              sort: { criteria: [] },
            },
          ],
        },
      ],
      preferences: {
        projectSizeLimit: 1000,
        frontmatter: {
          quoteStrings: "PLAIN",
        },
        locale: {
          firstDayOfWeek: "default",
        },
        commands: [...validCommands, ...invalidCommands, ...duplicatedCommands],
        linkBehavior: "open-editor",
      },
    });

    expect(got).toStrictEqual({
      ...got,
      preferences: {
        projectSizeLimit: 1000,
        frontmatter: {
          quoteStrings: "PLAIN",
        },
        locale: {
          firstDayOfWeek: "default",
        },

        commands: validCommands,
        linkBehavior: "open-editor",
      },
    });
  });
});
