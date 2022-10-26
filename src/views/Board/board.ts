import { get } from "svelte/store";

import { i18n } from "src/lib/stores/i18n";
import { isString, type DataRecord } from "src/lib/data";
import { notEmpty } from "src/lib/helpers";

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
	const noStatus = get(i18n).t("views.board.no-status");

	if (!fieldName) {
		return { [noStatus]: records };
	}

	const keys = unique(records, fieldName);

	const res: Record<string, Array<DataRecord>> = {
		[noStatus]: [],
	};
	for (let key of keys) {
		res[key] = [];
	}

	records.forEach((record, id) => {
		const value = record.values[fieldName];

		if (value && isString(value)) {
			res[value]?.push(record);
		} else {
			res[noStatus]?.push(record);
		}
	});

	if (!res[noStatus]?.length) {
		delete res[noStatus];
	}

	return res;
}
