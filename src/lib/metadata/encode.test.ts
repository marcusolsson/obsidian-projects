import { describe, expect, it } from "@jest/globals";
import { encodeFrontMatter, stringifyYaml } from "./encode";

describe("encodeFrontMatter", () => {
  it("should keep existing Markdown content", () => {
    expect(
      encodeFrontMatter(
        `
---
status: In progress
---

# My title
`,
        {
          status: "Done",
        }
      )
    ).toStrictEqual(`
---
status: Done
---

# My title
`);
  });
});

describe("stringifyYaml", () => {
  it("should strip quotes from string types", () => {
    expect(
      stringifyYaml({ bar: "Hello world", foo: "[[Untitled.md]]" })
    ).toStrictEqual("bar: Hello world\nfoo: [[Untitled.md]]\n");
  });

  it("should encode non-string types", () => {
    expect(stringifyYaml({ number: 6.25, boolean: true })).toStrictEqual(
      "number: 6.25\nboolean: true\n"
    );
  });
});

describe("regression test for issue #95", () => {
  it("should strip quotes from comma-separated list", () => {
    expect(stringifyYaml({ tags: "foo, bar, baz" })).toStrictEqual(
      "tags: foo, bar, baz\n"
    );
  });
});
