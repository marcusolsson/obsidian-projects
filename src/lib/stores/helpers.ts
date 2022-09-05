import {
	DataFieldType,
	isDate,
	isNumber,
	isBoolean,
	isLink,
	isString,
	type DataRecord,
	type DataField,
} from "../data";

export function detectFields(records: DataRecord[]): DataField[] {
	const fieldSet: Record<string, DataFieldType> = {};

	for (let record of records) {
		for (let field in record.values) {
			fieldSet[field] = fieldType(record.values[field]);
		}
	}

	let fields: DataField[] = [];

	for (let field in fieldSet) {
		const type = fieldSet[field];

		if (type && type !== DataFieldType.Unknown) {
			fields.push({ name: field, type });
		}
	}

	fields = [
		...fields.sort((a, b) => {
			return a.name.localeCompare(b.name);
		}),
	];

	return fields;
}

function fieldType(value: any): DataFieldType {
	if (isDate(value)) {
		return DataFieldType.Date;
	} else if (isString(value)) {
		return /\d{4}-\d{2}-\d{2}/.test(value)
			? DataFieldType.Date
			: DataFieldType.String;
	} else if (isNumber(value)) {
		return DataFieldType.Number;
	} else if (isBoolean(value)) {
		return DataFieldType.Boolean;
	} else if (isLink(value)) {
		return DataFieldType.Link;
	} else if (Array.isArray(value)) {
		return DataFieldType.List;
	}
	return DataFieldType.Unknown;
}
