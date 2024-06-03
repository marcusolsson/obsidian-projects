import { makeContext } from "src/lib/helpers";
import { DataFieldType, type DataField } from "../../lib/dataframe/dataframe";
import type { ViewProps } from "../app/useView";
import type { Menu } from "obsidian";

export function fieldIcon(field: DataFieldType): string {
  switch (field) {
    case DataFieldType.String:
      return "text";
    case DataFieldType.Number:
      return "binary";
    case DataFieldType.Boolean:
      return "check-square";
    case DataFieldType.Date:
      return "calendar";
    case DataFieldType.Datetime:
      return "clock";
  }
  return "file-question";
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

export const getRecordColorContext = makeContext<ViewProps["getRecordColor"]>();
export const sortRecordsContext = makeContext<ViewProps["sortRecords"]>();

export function menuOnContextMenu(event: MouseEvent, menu: Menu): void {
  const contextMenuFunc = (event: MouseEvent) => {
    window.removeEventListener("contextmenu", contextMenuFunc);
    event.preventDefault();
    event.stopPropagation();
    menu.showAtMouseEvent(event);
  };
  window.addEventListener("contextmenu", contextMenuFunc, false);
}
