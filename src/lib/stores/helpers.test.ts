import { describe, expect, it } from "@jest/globals";
import { DataFieldType } from "../data";
import { detectFields } from "./helpers";

describe("Detect fields", () => {
	it("detects all supported field types", async () => {
		const records = [
			{
				name: "",
				path: "",
				values: {
					string: "My string",
					number: 2.34,
					boolean: true,
					date: new Date(),
					link: {
						linkText: "Test",
						sourcePath: "Untitled.md",
					},
					tags: ["Foo", "Bar", "Baz"],
				},
			},
		];

		const fields = detectFields(records);

		expect(fields).toStrictEqual([
			{ name: "boolean", type: DataFieldType.Boolean },
			{ name: "date", type: DataFieldType.Date },
			{ name: "link", type: DataFieldType.Link },
			{ name: "number", type: DataFieldType.Number },
			{ name: "string", type: DataFieldType.String },
			{ name: "tags", type: DataFieldType.List },
		]);
	});
});
