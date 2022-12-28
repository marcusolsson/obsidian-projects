import { describe, it, expect } from "@jest/globals";

import {
  DataFieldType,
  type DataField,
  type DataRecord,
} from "../../../../lib/data";
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

  const weightField: DataField = {
    name: "weight",
    type: DataFieldType.Number,
    repeated: false,
    derived: false,
    identifier: false,
    userConfig: {},
  };
  const dueField: DataField = {
    name: "due",
    type: DataFieldType.Date,
    repeated: false,
    derived: false,
    identifier: false,
    userConfig: {},
  };

  it("should sort prioritized records", () => {
    expect(getPrioritizedRecords(records, weightField)).toStrictEqual([
      { ...records[2] },
      { ...records[3] },
      { ...records[0] },
    ]);
    expect(getPrioritizedRecords(records, dueField)).toStrictEqual([
      { ...records[1] },
      { ...records[2] },
      { ...records[0] },
    ]);
  });

  it("should sort unprioritized records", () => {
    expect(getUnprioritizedRecords(records, weightField)).toStrictEqual([
      { ...records[1] },
    ]);
    expect(getUnprioritizedRecords(records, dueField)).toStrictEqual([
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
