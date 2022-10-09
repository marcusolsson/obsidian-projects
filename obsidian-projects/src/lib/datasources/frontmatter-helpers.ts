import dayjs from "dayjs";
import {
	isRawLink,
	isString,
	type DataRecord,
	type DataValue,
	type Link,
} from "../data";

export function standardizeRecord(
	id: string,
	values: Record<string, any>
): DataRecord {
	const res: Record<string, DataValue> = {};

	Object.keys(values).forEach((field) => {
		const value = values[field];

		if (isRawLink(value)) {
			res[field] = parseRawLink(value, "");
		} else if (isString(value)) {
			if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
				res[field] = dayjs(value).toDate();
			} else {
				res[field] = value;
			}
		} else {
			res[field] = value;
		}
	});
	return {
		id,
		values: res,
	};
}

function parseRawLink(
	rawLink: Array<Array<string>>,
	sourcePath: string
): Link | undefined {
	if (rawLink[0]) {
		const linkText = rawLink[0][0];

		if (linkText) {
			return {
				linkText,
				sourcePath,
			};
		}
	}
	return undefined;
}
