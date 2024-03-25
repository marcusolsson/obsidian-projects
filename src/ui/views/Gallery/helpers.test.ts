import { describe, expect, it } from "@jest/globals";
import { parseObsidianLink } from "./helpers";

describe("parseObsidianLink", () => {
  it("parses non-link", () => {
    expect(parseObsidianLink("Untitled")).toBeNull();
  });

  it("parses simple wiki link", () => {
    expect(parseObsidianLink("[[Untitled]]")).toStrictEqual({
      linkText: "Untitled",
      displayName: "",
    });
  });

  it("parses wiki link with display name", () => {
    expect(parseObsidianLink("[[Untitled|Foo]]")).toStrictEqual({
      linkText: "Untitled",
      displayName: "Foo",
    });
  });

  it("parses simple wiki link embed", () => {
    expect(parseObsidianLink("![[Untitled]]")).toStrictEqual({
      linkText: "Untitled",
      displayName: "",
    });
  });

  it("parses wiki link embed with display name", () => {
    expect(parseObsidianLink("![[Untitled|Foo]]")).toStrictEqual({
      linkText: "Untitled",
      displayName: "Foo",
    });
  });

  it("parse simple markdown link", () => {
    expect(parseObsidianLink("[](obsidian-icon.png)")).toStrictEqual({
      linkText: "obsidian-icon.png",
      displayName: "",
    });
  });

  it("parse markdown link with display name", () => {
    expect(
      parseObsidianLink("[my awesome cover](obsidian-icon.png)")
    ).toStrictEqual({
      linkText: "obsidian-icon.png",
      displayName: "my awesome cover",
    });
  });

  it("parse simple markdown link embed", () => {
    expect(parseObsidianLink("![](obsidian-icon.png)")).toStrictEqual({
      linkText: "obsidian-icon.png",
      displayName: "",
    });
  });

  it("parse markdown link embed with display name", () => {
    expect(
      parseObsidianLink("[my awesome cover](obsidian-icon.png)")
    ).toStrictEqual({
      linkText: "obsidian-icon.png",
      displayName: "my awesome cover",
    });
  });
});
