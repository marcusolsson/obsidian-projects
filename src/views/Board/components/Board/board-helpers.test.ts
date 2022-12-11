import { describe, it, expect } from "@jest/globals";

import type { DataRecord } from "src/lib/data";
import {
  getDisplayName,
  getPrioritizedRecords,
  getUnprioritizedRecords,
} from "./board-helpers";

describe("board", () => {
  const records: DataRecord[] = [
    {
      id: "D.md",
      values: { weight: 3, due: new Date(Date.parse("2022-01-03")) },
    },
    {
      id: "B.md",
      values: { due: new Date(Date.parse("2022-01-01")) },
    },
    {
      id: "A.md",
      values: { weight: 2, due: new Date(Date.parse("2022-01-02")) },
    },
    {
      id: "C.md",
      values: { weight: 3 },
    },
  ];

  it("should sort prioritized records", () => {
    expect(getPrioritizedRecords(records, "weight")).toStrictEqual([
      { ...records[2] },
      { ...records[3] },
      { ...records[0] },
    ]);
    expect(getPrioritizedRecords(records, "due")).toStrictEqual([
      { ...records[1] },
      { ...records[2] },
      { ...records[0] },
    ]);
  });

  it("should sort unprioritized records", () => {
    expect(getUnprioritizedRecords(records, "weight")).toStrictEqual([
      { ...records[1] },
    ]);
    expect(getUnprioritizedRecords(records, "due")).toStrictEqual([
      { ...records[3] },
    ]);
  });
});

describe("getDisplayName", () => {
  it("should return the basename without the extension", () => {
    expect(getDisplayName(`Untitled.md`)).toStrictEqual("Untitled");
    expect(getDisplayName(`Work/Untitled.md`)).toStrictEqual("Untitled");
    expect(getDisplayName(`Work/Client A/Untitled.md`)).toStrictEqual(
      "Untitled"
    );
  });
});
