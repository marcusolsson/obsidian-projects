import { describe, it, expect } from "@jest/globals";
import { standardizeRecord } from "./standardize";

describe("frontmatter", () => {
  it("standardize", () => {
    const record = standardizeRecord("foo.md", {
      link: "[[Foo]]",
      status: "done",
      weight: 12,
      published: true,
      due: "2022-09-01",
    });

    expect(record).toStrictEqual({
      id: "foo.md",
      values: {
        link: "[[Foo]]",
        status: "done",
        weight: 12,
        published: true,
        due: "2022-09-01",
      },
    });
  });
});
