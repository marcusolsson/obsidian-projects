import { describe, expect, it } from "@jest/globals";
import { applySort } from "./viewSort";
import { Temporal } from "temporal-polyfill";

describe("applySort", () => {
  const frame = {
    fields: [],
    records: [
      {
        id: "Alice.md",
        values: {
          author: "Alice",
          age: 1,
          due: Temporal.PlainDate.from({
            year: 2001,
            month: 1,
            day: 1,
          }).toZonedDateTime(Temporal.Now.timeZoneId()),
          weight: 10,
        },
      },
      {
        id: "Charlie.md",
        values: {
          author: "Charlie",
          age: 3,
          due: Temporal.PlainDate.from({
            year: 2021,
            month: 1,
            day: 1,
          }).toZonedDateTime(Temporal.Now.timeZoneId()),
          weight: 100,
        },
      },
      {
        id: "Bob.md",
        values: {
          author: "Bob",
          age: 2,
          due: Temporal.PlainDate.from({
            year: 2011,
            month: 1,
            day: 1,
          }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
            due: Temporal.PlainDate.from({
              year: 2001,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 10,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: Temporal.PlainDate.from({
              year: 2001,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
            due: Temporal.PlainDate.from({
              year: 2001,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 10,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: Temporal.PlainDate.from({
              year: 2001,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
            due: Temporal.PlainDate.from({
              year: 2001,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 10,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: Temporal.PlainDate.from({
              year: 2001,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 10,
          },
        },
      ],
    });
  });

  it("sort by number (asc) and string (asc)", () => {
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
            due: Temporal.PlainDate.from({
              year: 2001,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 10,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: "Bob",
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
            weight: 100,
          },
        },
      ],
    });
  });
});

describe("natural sort", () => {
  const frame = {
    fields: [],
    records: [
      {
        id: "Section 1.md",
        values: {
          section: "1.Introduction",
        },
      },
      {
        id: "Section 11.md",
        values: {
          section: "11.References",
        },
      },
      {
        id: "Section 3.md",
        values: {
          section: "3.Results",
        },
      },
      {
        id: "Section 10.md",
        values: {
          section: "10.Acknowledgement",
        },
      },
      {
        id: "Section 2.md",
        values: {
          section: "2.Methods",
        },
      },
    ],
  };

  it("should sort strings containing numbers naturally", () => {
    const sorted = applySort(frame, {
      criteria: [{ field: "section", order: "asc", enabled: true }],
    });

    expect(sorted).toStrictEqual({
      fields: [],
      records: [
        {
          id: "Section 1.md",
          values: {
            section: "1.Introduction",
          },
        },
        {
          id: "Section 2.md",
          values: {
            section: "2.Methods",
          },
        },
        {
          id: "Section 3.md",
          values: {
            section: "3.Results",
          },
        },
        {
          id: "Section 10.md",
          values: {
            section: "10.Acknowledgement",
          },
        },
        {
          id: "Section 11.md",
          values: {
            section: "11.References",
          },
        },
      ],
    });
  });
});

describe("sort empty values to the end", () => {
  const frame = {
    fields: [],
    records: [
      {
        id: "Bob.md",
        values: {
          author: null,
          age: 2,
          due: Temporal.PlainDate.from({
            year: 2011,
            month: 1,
            day: 1,
          }).toZonedDateTime(Temporal.Now.timeZoneId()),
        },
      },
      {
        id: "Eve.md",
        values: {
          author: "",
          age: 3,
          due: Temporal.PlainDate.from({
            year: 2031,
            month: 1,
            day: 1,
          }).toZonedDateTime(Temporal.Now.timeZoneId()),
        },
      },
      {
        id: "David.md",
        values: {
          author: undefined,
          age: 4,
          due: Temporal.PlainDate.from({
            year: 2025,
            month: 1,
            day: 1,
          }).toZonedDateTime(Temporal.Now.timeZoneId()),
        },
      },
      {
        id: "Alice.md",
        values: {
          author: "Alice",
          age: 1,
          due: undefined,
        },
      },
      {
        id: "Charlie.md",
        values: {
          author: "Charlie",
          age: null,
          due: Temporal.PlainDate.from({
            year: 2021,
            month: 1,
            day: 1,
          }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
          id: "Eve.md",
          values: {
            author: "",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2031,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: undefined,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: null,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Bob.md",
          values: {
            author: null,
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "David.md",
          values: {
            author: undefined,
            age: 4,
            due: Temporal.PlainDate.from({
              year: 2025,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
            age: null,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: undefined,
          },
        },
        {
          id: "Eve.md",
          values: {
            author: "",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2031,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Bob.md",
          values: {
            author: null,
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "David.md",
          values: {
            author: undefined,
            age: 4,
            due: Temporal.PlainDate.from({
              year: 2025,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
            due: undefined,
          },
        },
        {
          id: "Bob.md",
          values: {
            author: null,
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Eve.md",
          values: {
            author: "",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2031,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "David.md",
          values: {
            author: undefined,
            age: 4,
            due: Temporal.PlainDate.from({
              year: 2025,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: null,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
          id: "David.md",
          values: {
            author: undefined,
            age: 4,
            due: Temporal.PlainDate.from({
              year: 2025,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Eve.md",
          values: {
            author: "",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2031,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Bob.md",
          values: {
            author: null,
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: undefined,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: null,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
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
          id: "Bob.md",
          values: {
            author: null,
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: null,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "David.md",
          values: {
            author: undefined,
            age: 4,
            due: Temporal.PlainDate.from({
              year: 2025,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Eve.md",
          values: {
            author: "",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2031,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: undefined,
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
          id: "Eve.md",
          values: {
            author: "",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2031,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "David.md",
          values: {
            author: undefined,
            age: 4,
            due: Temporal.PlainDate.from({
              year: 2025,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: null,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Bob.md",
          values: {
            author: null,
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: undefined,
          },
        },
      ],
    });
  });

  it("sort by string (asc) and date (desc)", () => {
    const sorted = applySort(frame, {
      criteria: [
        { field: "author", order: "asc", enabled: true },
        { field: "due", order: "desc", enabled: true },
      ],
    });

    expect(sorted).toStrictEqual({
      fields: [],
      records: [
        {
          id: "Eve.md",
          values: {
            author: "",
            age: 3,
            due: Temporal.PlainDate.from({
              year: 2031,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Alice.md",
          values: {
            author: "Alice",
            age: 1,
            due: undefined,
          },
        },
        {
          id: "Charlie.md",
          values: {
            author: "Charlie",
            age: null,
            due: Temporal.PlainDate.from({
              year: 2021,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "David.md",
          values: {
            author: undefined,
            age: 4,
            due: Temporal.PlainDate.from({
              year: 2025,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
        {
          id: "Bob.md",
          values: {
            author: null,
            age: 2,
            due: Temporal.PlainDate.from({
              year: 2011,
              month: 1,
              day: 1,
            }).toZonedDateTime(Temporal.Now.timeZoneId()),
          },
        },
      ],
    });
  });
});
