import type { Menu } from "obsidian";
import { DataFieldType, isNumber } from "../../../../../lib/types";

export type GridValidRowModel = { [key: string]: any };
export type GridRowModel<R extends GridValidRowModel = GridValidRowModel> = R;
export type GridColType = DataFieldType;

export interface GridColDef {
	field: string;
	width?: number;
	type?: GridColType;
	hide?: boolean;
	editable?: boolean;
	header?: boolean;
	weight?: number;
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
	return "alert-triangle";
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

		if (isNumber(aval) && isNumber(bval)) {
			if (aval < bval) {
				return isAsc ? -1 : 1;
			} else if (aval > bval) {
				return isAsc ? 1 : -1;
			} else {
				return 0;
			}
		}

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

export function sortColumns(columns: GridColDef[]): GridColDef[] {
	return columns.sort((a, b): number => {
		let left = a.weight ?? 9999;
		let right = b.weight ?? 9999;

		if (left < right) {
			return -1;
		} else if (left > right) {
			return 1;
		} else {
			return 0;
		}
	});
}

export function menuOnContextMenu(event: MouseEvent, menu: Menu): void {
	const contextMenuFunc = (event: MouseEvent) => {
		window.removeEventListener("contextmenu", contextMenuFunc);
		event.preventDefault();
		event.stopPropagation();
		menu.showAtMouseEvent(event);
	};
	window.addEventListener("contextmenu", contextMenuFunc, false);
}
