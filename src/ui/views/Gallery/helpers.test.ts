import { describe, expect, it } from "@jest/globals";
import { parseObsidianLink } from "./helpers";

describe("parseObsidianLink", () => {
  it("parses non-link", () => {
    expect(parseObsidianLink("Untitled")).toBeNull();
  });

  it("parses simple link", () => {
    expect(parseObsidianLink("[[Untitled]]")).toStrictEqual({
      linkText: "Untitled",
      displayName: "",
    });
  });

  it("parses link with display name", () => {
    expect(parseObsidianLink("[[Untitled|Foo]]")).toStrictEqual({
      linkText: "Untitled",
      displayName: "Foo",
    });
  });
});
