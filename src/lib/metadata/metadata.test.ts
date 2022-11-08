import { describe, expect, it } from "@jest/globals";
import { stringifyData } from "./metadata";

describe("stringify", () => {
  it("should strip quotes from string types", () => {
    expect(
      stringifyData({ bar: "Hello world", foo: "[[Untitled.md]]" })
    ).toStrictEqual("bar: Hello world\nfoo: [[Untitled.md]]\n");
  });

  it("should encode non-string types", () => {
    expect(stringifyData({ number: 6.25, boolean: true })).toStrictEqual(
      "number: 6.25\nboolean: true\n"
    );
  });
});

describe("regression test for issue #95", () => {
  it("should strip quotes from comma-separated list", () => {
    expect(stringifyData({ tags: "foo, bar, baz" })).toStrictEqual(
      "tags: foo, bar, baz\n"
    );
  });
});
