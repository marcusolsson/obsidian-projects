import type { Menu } from "obsidian";
import {DataFieldType, isNumber, type DataField, isDate} from "../../../../../lib/data";

export type GridValidRowModel = { [key: string]: any };
export type GridRowModel<R extends GridValidRowModel = GridValidRowModel> = R;
export type GridColType = DataFieldType;

export interface GridColDef extends DataField {
  readonly field: string;
  readonly width?: number;
  readonly hide?: boolean;
  readonly editable?: boolean;
  readonly header?: boolean;
}

export type GridRowId = string;

export interface GridRowProps {
  readonly rowId: GridRowId;
  readonly row: GridRowModel;
}

export interface GridSortModel {
  readonly field: string;
  readonly sort?: "asc" | "desc";
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

    if (isDate(aval) && isDate(bval)) {
      if (aval.getTime() < bval.getTime()) return isAsc ? -1 : 1;
      if (aval.getTime() > bval.getTime()) return isAsc ? 1 : -1;
      return 0;
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

export function menuOnContextMenu(event: MouseEvent, menu: Menu): void {
  const contextMenuFunc = (event: MouseEvent) => {
    window.removeEventListener("contextmenu", contextMenuFunc);
    event.preventDefault();
    event.stopPropagation();
    menu.showAtMouseEvent(event);
  };
  window.addEventListener("contextmenu", contextMenuFunc, false);
}
