import type { DataFieldType } from "src/lib/datasource";

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
