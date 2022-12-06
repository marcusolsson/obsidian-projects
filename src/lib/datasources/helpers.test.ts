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
        values: {
          number: "12",
          text: 100,
          boolean: "false",
          repeated: [1, 2, 3],
        },
      },
    ];

    const fields: DataField[] = [
      {
        name: "number",
        type: DataFieldType.Number,
        identifier: false,
        derived: false,
        repeated: false,
      },
      {
        name: "text",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
        repeated: false,
      },
      {
        name: "boolean",
        type: DataFieldType.Boolean,
        identifier: false,
        derived: false,
        repeated: false,
      },
      {
        name: "repeated",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
        repeated: true,
      },
    ];

    const expected: DataRecord[] = [
      {
        id: "Foo.md",
        values: { number: 12, text: "Foo", boolean: true, repeated: undefined },
      },
      {
        id: "Bar.md",
        values: {
          number: 12,
          text: "Bar",
          boolean: false,
          repeated: undefined,
        },
      },
      {
        id: "Baz.md",
        values: {
          number: 12,
          text: "100",
          boolean: false,
          repeated: [1, 2, 3],
        },
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
        repeated: false,
      },
      {
        name: "text",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
        repeated: false,
      },
      {
        name: "boolean",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
        repeated: false,
      },
      {
        name: "nullable",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
        repeated: false,
      },
    ];

    expect(detectFields(records)).toStrictEqual(fields);
  });
});

describe("detectCellType", () => {
  it("detects simple data types", () => {
    expect(detectCellType("My value")).toStrictEqual(DataFieldType.String);
    expect(detectCellType(12.0)).toStrictEqual(DataFieldType.Number);
    expect(detectCellType(true)).toStrictEqual(DataFieldType.Boolean);
  });

  it("detects repeated field types", () => {
    expect(detectCellType(["foo", "bar"])).toStrictEqual(DataFieldType.String);
    expect(detectCellType([1, 2])).toStrictEqual(DataFieldType.Number);

    // Fallback to String field
    expect(detectCellType([true, 1])).toStrictEqual(DataFieldType.String);
  });

  it("detects null fields", () => {
    expect(detectCellType(null)).toStrictEqual(DataFieldType.Unknown);
  });

  it("detects complex field types", () => {
    expect(detectCellType("2022-01-01")).toStrictEqual(DataFieldType.Date);
    expect(
      detectCellType({ linkText: "Foo", sourcePath: "Bar.md" })
    ).toStrictEqual(DataFieldType.Link);
    expect(detectCellType({ my: "object" })).toStrictEqual(
      DataFieldType.Unknown
    );
  });
});
