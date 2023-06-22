import { describe, expect, it } from "@jest/globals";
import {
  DataFieldType,
  type DataField,
} from "../../../lib/dataframe/dataframe";
import { sortFields } from "./helpers";

describe("sortFields", () => {
  it("sort single field", () => {
    const fields = [
      {
        name: "foo",
        type: DataFieldType.String,
        repeated: false,
        identifier: false,
        derived: false,
      },
    ];
    const order = ["foo"];

    const sorted = sortFields(fields, order);

    expect(sorted).toStrictEqual(fields);
  });

  it("sort fields where all are specified", () => {
    const defaultField: Omit<DataField, "name"> = {
      type: DataFieldType.String,
      repeated: false,
      identifier: false,
      derived: false,
    };

    const fields: DataField[] = [
      { name: "foo", ...defaultField },
      { name: "bar", ...defaultField },
      { name: "baz", ...defaultField },
    ];

    const want: DataField[] = [
      { name: "baz", ...defaultField },
      { name: "bar", ...defaultField },
      { name: "foo", ...defaultField },
    ];

    const order = ["baz", "bar", "foo"];

    const sorted = sortFields(fields, order);

    expect(sorted).toStrictEqual(want);
  });

  it("sorts unspecified fields last", () => {
    const defaultField: Omit<DataField, "name"> = {
      type: DataFieldType.String,
      repeated: false,
      identifier: false,
      derived: false,
    };

    const fields: DataField[] = [
      { name: "foo", ...defaultField },
      { name: "bar", ...defaultField },
      { name: "baz", ...defaultField },
    ];

    const want: DataField[] = [
      { name: "baz", ...defaultField },
      { name: "foo", ...defaultField },
      { name: "bar", ...defaultField },
    ];

    const order = ["baz", "foo"];

    const sorted = sortFields(fields, order);

    expect(sorted).toStrictEqual(want);
  });

  it("doesn't sort fields if order is empty", () => {
    const defaultField: Omit<DataField, "name"> = {
      type: DataFieldType.String,
      repeated: false,
      identifier: false,
      derived: false,
    };

    const fields: DataField[] = [
      { name: "foo", ...defaultField },
      { name: "baz", ...defaultField },
      { name: "bar", ...defaultField },
    ];

    const want: DataField[] = [
      { name: "foo", ...defaultField },
      { name: "baz", ...defaultField },
      { name: "bar", ...defaultField },
    ];

    const order: string[] = [];

    const sorted = sortFields(fields, order);

    expect(sorted).toStrictEqual(want);
  });
});
