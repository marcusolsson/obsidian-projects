import dayjs from "dayjs";
import type { DataValue } from "../../data";

/**
 * standardizeValues converts a Dataview data structure of values to the common
 * DataValue format.
 */
export function standardizeValues(
	values: Record<string, any>
): Record<string, DataValue> {
	const res: Record<string, DataValue> = {};

	Object.keys(values).forEach((field) => {
		const value = values[field];

		if (!value) {
			return;
		}

		if (typeof value === "object") {
			if ("path" in value) {
				res[field] = value.path;
			}
			if ("ts" in value) {
				res[field] = dayjs(value.ts).format("YYYY-MM-DD");
			}
		} else {
			res[field] = value;
		}
	});

	return res;
}
