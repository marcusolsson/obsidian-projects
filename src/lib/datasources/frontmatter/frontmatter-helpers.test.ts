import { describe, it, expect } from "@jest/globals";
import { standardizeRecord } from "./frontmatter-helpers";

describe("frontmatter", () => {
  it("standardize", () => {
    const record = standardizeRecord("foo.md", {
      link: [["Foo"]],
      status: "done",
      weight: 12,
      published: true,
      due: "2022-09-01",
    });

    expect(record).toStrictEqual({
      id: "foo.md",
      values: {
        link: {
          linkText: "Foo",
          sourcePath: "",
        },
        status: "done",
        weight: 12,
        published: true,
        due: "2022-09-01",
      },
    });
  });
});
