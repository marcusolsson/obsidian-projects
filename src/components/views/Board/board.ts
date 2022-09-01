import { isString, type DataRecord } from "src/lib/datasource";

export function notEmpty<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}

export function unique(records: DataRecord[], fieldName: string): string[] {
	const keys = records
		.map((record) => record.values[fieldName])
		.map((value) => (value && isString(value) ? value : null))
		.filter(notEmpty);

	const set = new Set(keys);

	return [...set];
}

export function groupRecordsByField(
	records: DataRecord[],
	fieldName: string
): Record<string, Array<[number, DataRecord]>> {
	const keys = unique(records, fieldName);

	const res: Record<string, Array<[number, DataRecord]>> = {};
	for (let key of keys) {
		res[key] = [];
	}

	records.forEach((record, id) => {
		const value = record.values[fieldName];
		if (value && isString(value)) {
			res[value]?.push([id, record]);
		}
	});

	return res;
}
