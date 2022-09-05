import { DataFieldType } from "src/lib/data";

export type GridValidRowModel = { [key: string]: any };
export type GridRowModel<R extends GridValidRowModel = GridValidRowModel> = R;
export type GridColType = DataFieldType;

export interface GridColDef {
	field: string;
	width?: number;
	type?: GridColType;
	editable?: boolean;
	header?: boolean;
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
		case DataFieldType.List:
			return "list";
	}
	return "info";
}

export function sortRows(
	rows: GridRowProps[],
	sortModel: GridSortModel
): GridRowProps[] {
	return rows.sort((a, b): number => {
		let aval = a.row[sortModel.field];
		let bval = b.row[sortModel.field];

		const isAsc = sortModel.sort === "asc";

		if (!aval && bval) return isAsc ? 1 : -1;
		if (aval && !bval) return isAsc ? -1 : 1;
		if (!aval && !bval) return 0;

		aval = aval.toString().toLocaleLowerCase();
		bval = bval.toString().toLocaleLowerCase();

		if (aval < bval) {
			return isAsc ? -1 : 1;
		} else if (aval > bval) {
			return isAsc ? 1 : -1;
		} else {
			return 0;
		}
	});
}
