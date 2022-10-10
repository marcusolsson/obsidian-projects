import { describe, it, expect } from "@jest/globals";
import dayjs from "dayjs";
import { standardizeRecord } from "./frontmatter-helpers";

describe("something", () => {
	it("bar", () => {
		const record = standardizeRecord("foo.md", {
			link: [["Foo"]],
			status: "done",
			weight: 12,
			published: true,
			due: "2022-09-01",
		});

		expect(record).toStrictEqual({
			id: "foo.md",
			values: {
				link: {
					linkText: "Foo",
					sourcePath: "",
				},
				status: "done",
				weight: 12,
				published: true,
				due: dayjs("2022-08-31T22:00:00.000Z").toDate(),
			},
		});
	});
});
