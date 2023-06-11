import { describe, expect, it } from "@jest/globals";
import { applySort } from "./viewSort";

describe("applySort", () => {
  const frame = {
    fields: [],
    records: [
      {
        id: "Alice.md",
        values: {
          author: "Alice",
          age: 1,
          due: new Date(Date.UTC(2001, 1, 1)),
          weight: 10,
        },
      },
      {
        id: "Charlie.md",
        values: {
          author: "Charlie",
          age: 3,
          due: new Date(Date.UTC(2021, 1, 1)),
          weight: 100,
        },
      },
      {
        id: "Bob.md",
        values: {
          author: "Bob",
          age: 2,
          due: new Date(Date.UTC(2011, 1, 1)),
          weight: 100,
        },
      },
    ],
  };

  it("sort by string asc", () => {
    const sorted = applySort(frame, {
      criteria: [{ field: "author", order: "asc", enabled: true }],
    });

    expect(sorted).toStrictEqual({
      fields: [],
      records: [
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: new Date(Date.UTC(2001, 1, 1)),
            weight: 10,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: new Date(Date.UTC(2011, 1, 1)),
            weight: 100,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: new Date(Date.UTC(2021, 1, 1)),
            weight: 100,
          },
        },
      ],
    });
  });

  it("sort by string desc", () => {
    const sorted = applySort(frame, {
      criteria: [{ field: "author", order: "desc", enabled: true }],
    });

    expect(sorted).toStrictEqual({
      fields: [],
      records: [
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: new Date(Date.UTC(2021, 1, 1)),
            weight: 100,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: new Date(Date.UTC(2011, 1, 1)),
            weight: 100,
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: new Date(Date.UTC(2001, 1, 1)),
            weight: 10,
          },
        },
      ],
    });
  });

  it("sort by number asc", () => {
    const sorted = applySort(frame, {
      criteria: [{ field: "age", order: "asc", enabled: true }],
    });

    expect(sorted).toStrictEqual({
      fields: [],
      records: [
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: new Date(Date.UTC(2001, 1, 1)),
            weight: 10,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: new Date(Date.UTC(2011, 1, 1)),
            weight: 100,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: new Date(Date.UTC(2021, 1, 1)),
            weight: 100,
          },
        },
      ],
    });
  });

  it("sort by number desc", () => {
    const sorted = applySort(frame, {
      criteria: [{ field: "age", order: "desc", enabled: true }],
    });

    expect(sorted).toStrictEqual({
      fields: [],
      records: [
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: new Date(Date.UTC(2021, 1, 1)),
            weight: 100,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: new Date(Date.UTC(2011, 1, 1)),
            weight: 100,
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: new Date(Date.UTC(2001, 1, 1)),
            weight: 10,
          },
        },
      ],
    });
  });

  it("sort by date asc", () => {
    const sorted = applySort(frame, {
      criteria: [{ field: "due", order: "asc", enabled: true }],
    });

    expect(sorted).toStrictEqual({
      fields: [],
      records: [
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: new Date(Date.UTC(2001, 1, 1)),
            weight: 10,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: new Date(Date.UTC(2011, 1, 1)),
            weight: 100,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: new Date(Date.UTC(2021, 1, 1)),
            weight: 100,
          },
        },
      ],
    });
  });

  it("sort by date desc", () => {
    const sorted = applySort(frame, {
      criteria: [{ field: "due", order: "desc", enabled: true }],
    });

    expect(sorted).toStrictEqual({
      fields: [],
      records: [
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: new Date(Date.UTC(2021, 1, 1)),
            weight: 100,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: new Date(Date.UTC(2011, 1, 1)),
            weight: 100,
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: new Date(Date.UTC(2001, 1, 1)),
            weight: 10,
          },
        },
      ],
    });
  });

  it("sort by number (asc) and string (desc)", () => {
    const sorted = applySort(frame, {
      criteria: [
        { field: "weight", order: "asc", enabled: true },
        { field: "author", order: "asc", enabled: true },
      ],
    });

    expect(sorted).toStrictEqual({
      fields: [],
      records: [
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: new Date(Date.UTC(2001, 1, 1)),
            weight: 10,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: new Date(Date.UTC(2011, 1, 1)),
            weight: 100,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: new Date(Date.UTC(2021, 1, 1)),
            weight: 100,
          },
        },
      ],
    });
  });
});
