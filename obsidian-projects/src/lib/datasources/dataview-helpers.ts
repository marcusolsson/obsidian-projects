import dayjs from "dayjs";
import type { DataValue } from "../data";

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
				res[field] = dayjs(value.ts).toDate();
			}
		} else {
			res[field] = value;
		}
	});

	return res;
}
