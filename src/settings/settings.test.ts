import { describe, expect, it } from "@jest/globals";
import { migrate } from "./settings";
import type * as v1 from "./v1/settings";
import type * as v2 from "./v2/settings";
import type * as base from "./base/settings";

describe("migrate from v1 to v2", () => {
  it("migrates default settings", () => {
    expect(migrate(v1demo)).toStrictEqual(v2demo);
  });
});

const v1demo: v1.ProjectsPluginSettings<
  v1.ProjectDefinition<base.ViewDefinition>
> = {
  version: 1,
  projects: [
    {
      path: "Projects - Demo Project",
      recursive: false,
      fieldConfig: {},
      defaultName: "",
      templates: [],
      dataview: false,
      query: "",
      excludedNotes: [],
      isDefault: false,
      name: "Demo project",
      id: "861e5eaf-162e-4c4b-be1e-7556e2a8c889",
      views: [
        {
          config: {
            fieldConfig: {
              name: {
                width: 360,
              },
              path: {
                hide: true,
              },
            },
          },
          filter: {
            conditions: [],
          },
          colors: {
            conditions: [],
          },
          sort: {
            criteria: [],
          },
          name: "Table",
          id: "0a53aff7-804d-466d-977d-444b9ca6d13a",
          type: "table",
        },
        {
          config: {
            groupByField: "status",
            priorityField: "weight",
          },
          filter: {
            conditions: [],
          },
          colors: {
            conditions: [],
          },
          sort: {
            criteria: [],
          },
          name: "Board",
          id: "d62f729f-3148-4a5b-93e2-781ff5be7542",
          type: "board",
        },
        {
          config: {
            interval: "month",
            dateField: "due",
            checkField: "published",
          },
          filter: {
            conditions: [],
          },
          colors: {
            conditions: [],
          },
          sort: {
            criteria: [],
          },
          name: "Calendar",
          id: "1f1b74a7-ab7b-4fb5-8a18-0cb18f997aa7",
          type: "calendar",
        },
        {
          config: {
            coverField: "image",
          },
          filter: {
            conditions: [],
          },
          colors: {
            conditions: [],
          },
          sort: {
            criteria: [],
          },
          name: "Gallery",
          id: "64713d5a-683d-4f19-9cf9-d90dde311fc8",
          type: "gallery",
        },
      ],
    },
  ],
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
};

const v2demo: v2.ProjectsPluginSettings<
  v2.ProjectDefinition<base.ViewDefinition>,
  base.ProjectsPluginPreferences
> = {
  version: 2,
  projects: [
    {
      fieldConfig: {},
      defaultName: "",
      templates: [],
      excludedNotes: [],
      isDefault: false,
      dataSource: {
        kind: "folder",
        config: {
          path: "Projects - Demo Project",
          recursive: false,
        },
      },
      newNotesFolder: "",
      views: [
        {
          config: {
            fieldConfig: {
              name: {
                width: 360,
              },
              path: {
                hide: true,
              },
            },
          },
          filter: {
            conditions: [],
          },
          colors: {
            conditions: [],
          },
          sort: {
            criteria: [],
          },
          name: "Table",
          id: "0a53aff7-804d-466d-977d-444b9ca6d13a",
          type: "table",
        },
        {
          config: {
            groupByField: "status",
            priorityField: "weight",
          },
          filter: {
            conditions: [],
          },
          colors: {
            conditions: [],
          },
          sort: {
            criteria: [],
          },
          name: "Board",
          id: "d62f729f-3148-4a5b-93e2-781ff5be7542",
          type: "board",
        },
        {
          config: {
            interval: "month",
            dateField: "due",
            checkField: "published",
          },
          filter: {
            conditions: [],
          },
          colors: {
            conditions: [],
          },
          sort: {
            criteria: [],
          },
          name: "Calendar",
          id: "1f1b74a7-ab7b-4fb5-8a18-0cb18f997aa7",
          type: "calendar",
        },
        {
          config: {
            coverField: "image",
          },
          filter: {
            conditions: [],
          },
          colors: {
            conditions: [],
          },
          sort: {
            criteria: [],
          },
          name: "Gallery",
          id: "64713d5a-683d-4f19-9cf9-d90dde311fc8",
          type: "gallery",
        },
      ],
      name: "Demo project",
      id: "861e5eaf-162e-4c4b-be1e-7556e2a8c889",
    },
  ],
  archives: [],
  preferences: {
    projectSizeLimit: 1000,
    frontmatter: {
      quoteStrings: "PLAIN",
    },
    locale: {
      firstDayOfWeek: "default",
    },
    commands: [],
    linkBehavior: "open-editor",
  },
};
