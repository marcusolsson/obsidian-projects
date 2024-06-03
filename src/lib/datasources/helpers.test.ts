import { test, describe, expect, it } from "@jest/globals";
import {
  DataFieldType,
  type DataField,
  type DataRecord,
} from "../dataframe/dataframe";
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
        typeConfig: {},
      },
      {
        name: "text",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
        repeated: false,
        typeConfig: {},
      },
      {
        name: "boolean",
        type: DataFieldType.Boolean,
        identifier: false,
        derived: false,
        repeated: false,
        typeConfig: {},
      },
      {
        name: "repeated",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
        repeated: true,
        typeConfig: {},
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
        typeConfig: {},
      },
      {
        name: "text",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
        repeated: false,
        typeConfig: {},
      },
      {
        name: "boolean",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
        repeated: false,
        typeConfig: {},
      },
      {
        name: "nullable",
        type: DataFieldType.String,
        identifier: false,
        derived: false,
        repeated: false,
        typeConfig: {},
      },
    ];

    expect(detectFields(records)).toStrictEqual(fields);
  });
});

describe("detectCellType", () => {
  const cases: [unknown, DataFieldType][] = [
    // Primitive values.
    [null, DataFieldType.Unknown],
    [undefined, DataFieldType.Unknown],
    ["My value", DataFieldType.String],
    ["", DataFieldType.String],
    [12.0, DataFieldType.Number],
    [0, DataFieldType.Number],
    [true, DataFieldType.Boolean],
    [false, DataFieldType.Boolean],

    // Repeated values.
    [["foo", "bar"], DataFieldType.String],
    [[null, "bar"], DataFieldType.String],
    [[1, 2], DataFieldType.Number],
    [[1, null], DataFieldType.Number],
    [[true, false], DataFieldType.Boolean],
    [[null, false], DataFieldType.Boolean],
    [[true, 1], DataFieldType.String], // Fall back to String field.
    [[], DataFieldType.String], // Current behavior, but is this what we want?

    // Complex values.
    ["2022-01-01", DataFieldType.Date],
    ["2022-01-01T22:35", DataFieldType.Date],
    [{ my: "object" }, DataFieldType.Unknown],
  ];

  test.each(cases)("%s should be detected as %s", (value, expected) => {
    expect(detectCellType(value)).toStrictEqual(expected);
  });
});
