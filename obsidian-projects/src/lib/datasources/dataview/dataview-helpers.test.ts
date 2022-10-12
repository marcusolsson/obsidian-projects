import { describe, it, expect } from "@jest/globals";
import { standardizeValues } from "./dataview-helpers";

describe("dataview", () => {
	it("standardize", () => {
		const record = standardizeValues({
			File: {
				path: "foo.md",
			},
			status: "done",
			weight: 12,
			published: true,
		});

		expect(record).toStrictEqual({
			File: "foo.md",
			status: "done",
			weight: 12,
			published: true,
		});
	});
});
