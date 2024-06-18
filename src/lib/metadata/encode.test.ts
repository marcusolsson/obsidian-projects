import { describe, expect, it } from "@jest/globals";
import { either as E } from "fp-ts";
import { encodeFrontMatter, stringifyYaml } from "./encode";

describe("encodeFrontMatter", () => {
  it("should quote string if it contains illegal characters", () => {
    expect(
      encodeFrontMatter(
        ``,
        {
          title1: "Notes: Who Needs Them?",
          title2: "key:value",
          title3: "key:",
          title4: "- Title",
          title5: "Title-",
          title6: "-Title",
        },
        "PLAIN"
      )
    ).toStrictEqual(
      E.right(`---
title1: "Notes: Who Needs Them?"
title2: key:value
title3: "key:"
title4: "- Title"
title5: Title-
title6: -Title
---

`)
    );
  });

  it("should keep existing Markdown content", () => {
    expect(
      encodeFrontMatter(
        `---
status: In progress
---

# My title
`,
        {
          status: "Done",
        },
        "PLAIN"
      )
    ).toStrictEqual(
      E.right(`---
status: Done
---

# My title
`)
    );
  });

  it("should keep existing properties", () => {
    expect(
      encodeFrontMatter(
        `---
status: In progress
due: 1979-01-01
---

# My title
`,
        {
          status: "Done",
        },
        "PLAIN"
      )
    ).toStrictEqual(
      E.right(`---
status: Done
due: 1979-01-01
---

# My title
`)
    );
  });

  it("should keep existing properties", () => {
    expect(
      encodeFrontMatter(
        ``,
        {
          status: null,
        },
        "PLAIN"
      )
    ).toStrictEqual(
      E.right(`---
status:
---

`)
    );
  });

  it("should handle null and undefined", () => {
    expect(
      encodeFrontMatter(
        `---
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
        },
        "PLAIN"
      )
    ).toStrictEqual(
      E.right(`---
foo: "5"
baz:
test: 4
---

# My title
`)
    );
  });

  it("should ignore non-leading front matter", () => {
    expect(
      encodeFrontMatter(
        `# My title

---
some text
---
`,
        {
          status: "Done",
        },
        "PLAIN"
      )
    ).toStrictEqual(
      E.right(`---
status: Done
---

# My title

---
some text
---
`)
    );
  });
});

describe("stringifyYaml", () => {
  it("should strip quotes from string types", () => {
    expect(
      stringifyYaml({ bar: "Hello world", foo: "[[Untitled.md]]" })
    ).toStrictEqual('bar: Hello world\nfoo: "[[Untitled.md]]"\n');
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
