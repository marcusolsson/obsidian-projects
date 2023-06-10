import { expect, test } from "@jest/globals";
import { interpolateTemplate } from "./interpolate";

test("interpolate string data", () => {
  expect(
    interpolateTemplate("foo {{title}} bar", { title: () => "something" })
  ).toStrictEqual("foo something bar");

  expect(
    interpolateTemplate("foo {{date:YYYY-MM-DD}} bar", {
      date: (format) => format ?? "",
    })
  ).toStrictEqual("foo YYYY-MM-DD bar");

  expect(
    interpolateTemplate("foo {{time:HH:mm}} bar", {
      time: (format) => format ?? "",
    })
  ).toStrictEqual("foo HH:mm bar");

  expect(
    interpolateTemplate("foo {{ date:YYYY-MM-DD }} bar", {
      date: (format) => format ?? "",
    })
  ).toStrictEqual("foo YYYY-MM-DD bar");
});
