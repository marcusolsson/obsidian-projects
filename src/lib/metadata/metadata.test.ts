import { expect, test } from "@jest/globals";
import { stringifyData } from "./metadata";

test("stringify", () => {
  expect(
    stringifyData({ bar: "Hello world", foo: "[[Untitled.md]]" })
  ).toStrictEqual("bar: Hello world\nfoo: [[Untitled.md]]\n");

  expect(stringifyData({ number: 6.25, boolean: true })).toStrictEqual(
    "number: 6.25\nboolean: true\n"
  );
});
