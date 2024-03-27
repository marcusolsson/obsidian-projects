import type { Menu } from "obsidian";
import type { DataFieldType, DataField } from "src/lib/dataframe/dataframe";

export type GridValidRowModel = { [key: string]: any };
export type GridRowModel<R extends GridValidRowModel = GridValidRowModel> = R;
export type GridColType = DataFieldType;

export interface GridColDef extends DataField {
  readonly field: string;
  readonly width?: number;
  readonly hide?: boolean;
  readonly editable?: boolean;
  readonly header?: boolean;
  readonly pinned?: boolean;
}

export type GridRowId = string;

export interface GridRowProps {
  readonly rowId: GridRowId;
  readonly row: GridRowModel;
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
