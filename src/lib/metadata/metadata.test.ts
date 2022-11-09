import { describe, expect, it } from "@jest/globals";
import {
  encodeFrontMatter,
  parseYaml,
  preprocessYaml,
  stringifyYaml,
} from "./metadata";

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

describe("preprocessYaml", () => {
  it("should escape internal links", () => {
    expect(
      preprocessYaml(`unquoted: [[Untitled.md]]\nquoted: "[[Untitled.md]]"`)
    ).toStrictEqual(`unquoted: "[[Untitled.md]]"\nquoted: "[[Untitled.md]]"`);
  });

  it("should escape comma-separated internal links", () => {
    expect(
      preprocessYaml(`unquoted: [[Untitled.md]], [[Untitled.md]]`)
    ).toStrictEqual(`unquoted: "[[Untitled.md]], [[Untitled.md]]"`);
  });

  it("shouldn't escape already escaped comma-separated internal links", () => {
    expect(
      preprocessYaml(`quoted: "[[Untitled.md]], [[Untitled.md]]"`)
    ).toStrictEqual(`quoted: "[[Untitled.md]], [[Untitled.md]]"`);
  });
});

describe("parse", () => {
  it("should parse links", () => {
    expect(
      parseYaml(`unquoted: [[Untitled.md]]\nquoted: "[[Untitled.md]]"`)
    ).toStrictEqual({
      unquoted: "[[Untitled.md]]",
      quoted: "[[Untitled.md]]",
    });
  });

  it("should parse multiple links", () => {
    expect(
      parseYaml(`field: [[Untitled.md]], [[Untitled 1.md]]`)
    ).toStrictEqual({
      field: "[[Untitled.md]], [[Untitled 1.md]]",
    });
  });

  it("should parse lists", () => {
    expect(
      parseYaml(`
foo:
- tag1
- tag2
- tag3
`)
    ).toStrictEqual({
      foo: ["tag1", "tag2", "tag3"],
    });
  });

  // This test documents existing behavior, but not necessary the desired
  // behavior.
  it("should parse tags as comments", () => {
    expect(
      parseYaml(`
foo:
- #tag1
- #tag2
- #tag3
`)
    ).toStrictEqual({
      foo: [null, null, null],
    });
  });
});

describe("stringify", () => {
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
