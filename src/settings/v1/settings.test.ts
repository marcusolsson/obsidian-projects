import { describe, expect, it } from "@jest/globals";
import { resolve } from "./settings";

describe("resolve v2", () => {
  it("resolves minimum", () => {
    const got = resolve({ version: 1 });

    expect(got).toStrictEqual({
      version: 1,
      projects: [],
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
    const got = resolve({ version: 1, projects: [{ name: "Foo", id: "foo" }] });

    expect(got).toStrictEqual({
      version: 1,
      projects: [
        {
          name: "Foo",
          id: "foo",
          fieldConfig: {},
          defaultName: "",
          templates: [],
          excludedNotes: [],
          isDefault: false,
          views: [],
          dataview: false,
          path: "",
          query: "",
          recursive: false,
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
    });
  });
});
