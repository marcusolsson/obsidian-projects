import { DataFieldType } from "src/lib/data";

export type GridValidRowModel = { [key: string]: any };
export type GridRowModel<R extends GridValidRowModel = GridValidRowModel> = R;
export type GridColType = DataFieldType;

export interface GridColDef {
	field: string;
	width?: number;
	type?: GridColType;
	editable?: boolean;
}

export type GridRowId = string;

export interface GridRowProps {
	rowId: GridRowId;
	row: GridRowModel;
}

export interface GridSortModel {
	field: string;
	sort?: "asc" | "desc";
}

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
