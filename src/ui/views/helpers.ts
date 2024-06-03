import { makeContext } from "src/lib/helpers";
import { DataFieldType, type DataField } from "../../lib/dataframe/dataframe";
import type { ViewProps } from "../app/useView";
import type { Menu } from "obsidian";

import { i18n } from "src/lib/stores/i18n";
import { get } from "svelte/store";

export function fieldIcon(field: DataField): string {
  switch (field.type) {
    case DataFieldType.String:
      if (field.repeated) {
        switch (field.name) {
          case "tags":
            return "tags";
          case "aliases":
            return "forward";
        }
        return "list";
      }
      return "text";
    case DataFieldType.Number:
      return "binary";
    case DataFieldType.Boolean:
      return "check-square";
    case DataFieldType.Date:
      return "calendar";
  }
  return "file-question";
}

export function fieldDisplayText(field: DataField): string {
  switch (field.type) {
    case DataFieldType.String:
      if (field.repeated) {
        switch (field.name) {
          case "tags":
            return get(i18n).t("data-types.tags");
          case "aliases":
            return get(i18n).t("data-types.aliases");
        }
        return get(i18n).t("data-types.list");
      }
      return get(i18n).t("data-types.string");
    case DataFieldType.Number:
      return get(i18n).t("data-types.number");
    case DataFieldType.Boolean:
      return get(i18n).t("data-types.boolean");
    case DataFieldType.Date:
      return get(i18n).t("data-types.date");
  }
  return get(i18n).t("data-types.unknown");
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
