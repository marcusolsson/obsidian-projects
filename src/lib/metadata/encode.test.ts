import { describe, expect, it } from "@jest/globals";
import { encodeFrontMatter, stringifyYaml } from "./encode";

describe("encodeFrontMatter", () => {
  it("should quote string if it contains illegal characters", () => {
    expect(
      encodeFrontMatter(``, {
        title1: "Notes: Who Needs Them?",
        title2: "key:value",
        title3: "key:",
        title4: "- Title",
        title5: "Title-",
        title6: "-Title",
      })
    ).toStrictEqual(`---
title1: "Notes: Who Needs Them?"
title2: key:value
title3: key:
title4: "- Title"
title5: Title-
title6: -Title
---

`);
  });

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

  it("should keep existing properties", () => {
    expect(
      encodeFrontMatter(
        `
---
status: In progress
due: 1979-01-01
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
due: 1979-01-01
---

# My title
`);
  });

  it("should keep existing properties", () => {
    expect(
      encodeFrontMatter(``, {
        status: null,
      })
    ).toStrictEqual(`---
status:
---

`);
  });

  it("should handle null and undefined", () => {
    expect(
      encodeFrontMatter(
        `
---
foo: 1
bar: 2
baz: 3
test: 4
---

# My title
`,
        {
          foo: "5",
          bar: undefined,
          baz: null,
        }
      )
    ).toStrictEqual(`
---
foo: 5
baz:
test: 4
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

describe("regression test for issue #134", () => {
  it("should not fold long strings", () => {
    expect(
      stringifyYaml({
        longstring:
          "-----------------------------------------------------------------------------------",
      })
    ).toStrictEqual(
      "longstring: -----------------------------------------------------------------------------------\n"
    );
  });
});
