import { isString, type DataRecord } from "src/lib/data";

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
	fieldName: string | undefined
): Record<string, Array<DataRecord>> {
	if (!fieldName) {
		return { "No status": records };
	}

	const keys = unique(records, fieldName);

	const res: Record<string, Array<DataRecord>> = { "No status": [] };
	for (let key of keys) {
		res[key] = [];
	}

	records.forEach((record, id) => {
		const value = record.values[fieldName];

		if (value && isString(value)) {
			res[value]?.push(record);
		} else {
			res["No status"]?.push(record);
		}
	});

	return res;
}
