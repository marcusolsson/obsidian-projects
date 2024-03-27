import { describe, it, expect } from "@jest/globals";
import { getDisplayName } from "./boardHelpers";

describe("getDisplayName", () => {
  it("should return the basename without the extension", () => {
    expect(getDisplayName(`Untitled.md`)).toStrictEqual("Untitled");
    expect(getDisplayName(`Work/Untitled.md`)).toStrictEqual("Untitled");
    expect(getDisplayName(`Work/Client A/Untitled.md`)).toStrictEqual(
      "Untitled"
    );
  });
});
