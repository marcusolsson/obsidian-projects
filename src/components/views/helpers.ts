import { DataFieldType, type DataField } from "../../lib/data";

export function fieldIcon(field: DataFieldType): string {
	switch (field) {
		case DataFieldType.String:
			return "text";
		case DataFieldType.Number:
			return "hash";
		case DataFieldType.Boolean:
			return "check";
		case DataFieldType.Date:
			return "calendar-days";
		case DataFieldType.Link:
			return "link";
	}
	return "info";
}

export function fieldToSelectableValue(field: DataField): {
	label: string;
	value: string;
} {
	return {
		label: field.name,
		value: field.name,
	};
}
