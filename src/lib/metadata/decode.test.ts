import { describe, expect, it } from "@jest/globals";
import { either as E } from "fp-ts";
import { decodeFrontMatter, parseYaml, preprocessYaml } from "./decode";

describe("decodeFrontMatter", () => {
  it("should decode note with Markdown content", () => {
    expect(
      decodeFrontMatter(
        `
---
status: In progress
---

# My title
`
      )
    ).toStrictEqual(E.right({ status: "In progress" }));
  });

  it("should ignore non-leading front matter", () => {
    expect(
      decodeFrontMatter(
        `
# My title

---
status: In progress
---
`
      )
    ).toStrictEqual(E.right({}));
  });

  it("should decode note with missing front matter", () => {
    expect(
      decodeFrontMatter(
        `
# My title
`
      )
    ).toStrictEqual(E.right({}));
  });
});

describe("preprocessYaml", () => {
  it("should escape internal links", () => {
    expect(
      preprocessYaml(`unquoted: [[Untitled.md]]\nquoted: "[[Untitled.md]]"`)
    ).toStrictEqual(`unquoted: "[[Untitled.md]]"\nquoted: "[[Untitled.md]]"`);
  });

  it("should escape embedded images", () => {
    expect(
      preprocessYaml(`unquoted: ![[Untitled.md]]\nquoted: "![[Untitled.md]]"`)
    ).toStrictEqual(`unquoted: "![[Untitled.md]]"\nquoted: "![[Untitled.md]]"`);
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

describe("parseYaml", () => {
  it("should parse links", () => {
    expect(
      parseYaml(`unquoted: [[Untitled.md]]\nquoted: "[[Untitled.md]]"`)
    ).toStrictEqual(
      E.right({
        unquoted: "[[Untitled.md]]",
        quoted: "[[Untitled.md]]",
      })
    );
  });

  it("should parse multiple links", () => {
    expect(
      parseYaml(`field: [[Untitled.md]], [[Untitled 1.md]]`)
    ).toStrictEqual(
      E.right({
        field: "[[Untitled.md]], [[Untitled 1.md]]",
      })
    );
  });

  it("should parse lists", () => {
    expect(
      parseYaml(`
foo:
- tag1
- tag2
- tag3
`)
    ).toStrictEqual(
      E.right({
        foo: ["tag1", "tag2", "tag3"],
      })
    );
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
    ).toStrictEqual(
      E.right({
        foo: [null, null, null],
      })
    );
  });
});

describe("regression test for issue #160", () => {
  it("should decode space-delimited links", () => {
    expect(
      decodeFrontMatter(
        `
---
headings:
  - "[[testmeet3 note#Summary|📝]] [[testmeet3 note#Ideas|💡]] [[testmeet3 note#Attendees|🧑‍🤝‍🧑]]"
---

# My title
`
      )
    ).toStrictEqual(
      E.right({
        headings: [
          "[[testmeet3 note#Summary|📝]] [[testmeet3 note#Ideas|💡]] [[testmeet3 note#Attendees|🧑‍🤝‍🧑]]",
        ],
      })
    );
  });
});

describe("regression test for issue #175", () => {
  it("should decode note with empty front matter", () => {
    expect(
      decodeFrontMatter(
        `
---
---

# My title
`
      )
    ).toStrictEqual(E.right({}));
  });
});
