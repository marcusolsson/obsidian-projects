import dayjs from "dayjs";
import produce from "immer";
import { parseYaml, stringifyYaml, type FrontMatterCache } from "obsidian";
import { isDate, type DataRecord } from "./data";

export function doUpdateRecord(data: string, record: DataRecord): string {
	const frontmatter = decodeFrontMatter(data);

	const updated = Object.fromEntries(
		Object.entries({ ...frontmatter, ...record.values })
			.map((entry) =>
				isDate(entry[1])
					? produce(entry, (draft) => {
							draft[1] = dayjs(entry[1]).format("YYYY-MM-DD");
					  })
					: entry
			)
			.filter((entry) => entry[1] !== undefined)
			.filter((entry) => entry[1] !== null)
	);

	return encodeFrontMatter(data, updated);
}

export function doDeleteField(data: string, field: string) {
	const frontmatter = decodeFrontMatter(data);

	frontmatter[field] = null;

	const updated = Object.fromEntries(
		Object.entries(frontmatter)
			.filter((entry) => entry[1] !== undefined)
			.filter((entry) => entry[1] !== null)
	);

	return encodeFrontMatter(data, updated);
}

function decodeFrontMatter(data: string): Omit<FrontMatterCache, "position"> {
	const delim = "---";

	var startPosition = data.indexOf(delim) + delim.length;

	const isStart = data.slice(0, startPosition).trim() === delim;

	var endPosition = data.slice(startPosition).indexOf(delim) + startPosition;

	const hasFrontMatter = isStart && endPosition > startPosition;

	const { position, ...cache }: FrontMatterCache = hasFrontMatter
		? parseYaml(data.slice(startPosition, endPosition))
		: {};

	return cache;
}

function encodeFrontMatter(
	data: string,
	frontmatter: Omit<FrontMatterCache, "position>">
): string {
	const delim = "---";

	var startPosition = data.indexOf(delim) + delim.length;

	const isStart = data.slice(0, startPosition).trim() === delim;

	var endPosition = data.slice(startPosition).indexOf(delim) + startPosition;

	const hasFrontMatter = isStart && endPosition > startPosition;

	if (Object.entries(frontmatter).length) {
		const res = hasFrontMatter
			? data.slice(0, startPosition + 1) +
			  stringifyYaml(frontmatter) +
			  data.slice(endPosition)
			: delim + "\n" + stringifyYaml(frontmatter) + delim + "\n\n" + data;

		return res;
	}

	return hasFrontMatter
		? data.slice(0, startPosition - delim.length) +
				data.slice(endPosition + delim.length + 1)
		: data;
}
