import { describe, expect, it } from "@jest/globals";
import { DataFieldType, type DataField, type DataRecord } from "../../lib/data";
import { detectCellType, detectFields, parseRecords } from "./helpers";

describe("parseRecords", () => {
  it("parses", () => {
    const records: DataRecord[] = [
      {
        id: "Foo.md",
        values: { number: 12, text: "Foo", boolean: true },
      },
      {
        id: "Bar.md",
        values: { number: 12, text: "Bar", boolean: false },
      },
      {
        id: "Baz.md",
        values: { number: "12", text: 100, boolean: "false" },
      },
    ];

    const fields: DataField[] = [
      {
        name: "number",
        type: DataFieldType.Number,
        identifier: false,
        derived: false,
      },
      {
        name: "text",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
      },
      {
        name: "boolean",
        type: DataFieldType.Boolean,
        identifier: false,
        derived: false,
      },
    ];

    const expected: DataRecord[] = [
      {
        id: "Foo.md",
        values: { number: 12, text: "Foo", boolean: true },
      },
      {
        id: "Bar.md",
        values: { number: 12, text: "Bar", boolean: false },
      },
      {
        id: "Baz.md",
        values: { number: 12, text: "100", boolean: false },
      },
    ];

    expect(parseRecords(records, fields)).toStrictEqual(expected);
  });
});

describe("detectFields", () => {
  it("detects", () => {
    const records: DataRecord[] = [
      {
        id: "Foo.md",
        values: { number: 12, text: "Foo", boolean: true, nullable: null },
      },
      {
        id: "Bar.md",
        values: { number: 12, text: "Bar", boolean: false, nullable: null },
      },
      {
        id: "Baz.md",
        values: { number: 12, text: 100, boolean: "false", nullable: null },
      },
    ];
    const fields: DataField[] = [
      {
        name: "number",
        type: DataFieldType.Number,
        identifier: false,
        derived: false,
      },
      {
        name: "text",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
      },
      {
        name: "boolean",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
      },
      {
        name: "nullable",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
      },
    ];

    expect(detectFields(records)).toStrictEqual(fields);
  });
});

describe("detectCellType", () => {
  it("detects", () => {
    expect(detectCellType("My value")).toStrictEqual(DataFieldType.String);
    expect(detectCellType(12.0)).toStrictEqual(DataFieldType.Number);
    expect(detectCellType(true)).toStrictEqual(DataFieldType.Boolean);
    expect(detectCellType("2022-01-01")).toStrictEqual(DataFieldType.Date);
    expect(detectCellType(["foo", "bar"])).toStrictEqual(DataFieldType.List);
    expect(detectCellType([1, 2])).toStrictEqual(DataFieldType.List);
    expect(
      detectCellType({ linkText: "Foo", sourcePath: "Bar.md" })
    ).toStrictEqual(DataFieldType.Link);
    expect(detectCellType({ my: "object" })).toStrictEqual(
      DataFieldType.Unknown
    );
    expect(detectCellType(null)).toStrictEqual(DataFieldType.Unknown);
  });
});
