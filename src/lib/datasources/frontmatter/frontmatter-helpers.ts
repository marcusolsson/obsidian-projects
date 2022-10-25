import {
	isRawLink,
	type DataRecord,
	type DataValue,
	type Link,
} from "../../data";

/**
 * standardizeValues converts front matter YAML data to the common DataValue
 * format.
 */
export function standardizeRecord(
	id: string,
	values: Record<string, any>
): DataRecord {
	const res: Record<string, DataValue> = {};

	Object.keys(values).forEach((field) => {
		const value = values[field];

		if (isRawLink(value)) {
			res[field] = parseRawLink(value, "");
		} else {
			res[field] = value;
		}
	});
	return {
		id,
		values: res,
	};
}

/**
 * parseRawLink parses internal links in the front matter.
 *
 * Values in the form of "[[My note]]" get parsed as a two-dimensional array
 * with a single string value.
 */
function parseRawLink(
	rawLink: Array<Array<string>>,
	sourcePath: string
): Link | undefined {
	if (rawLink[0]) {
		const text = rawLink[0][0];

		if (text) {
			const split = text.split("|");

			const linkText = split[0] ?? "";

			const link: Link = {
				linkText,
				sourcePath,
			};

			return split[1] ? { ...link, displayName: split[1] } : link;
		}
	}
	return undefined;
}
