import { get } from "svelte/store";
import { customViews } from "src/lib/stores/custom-views";

import { BoardView } from "../Board";
import { CalendarView } from "../Calendar";
import { CustomView } from "../Custom";
import { DeveloperView } from "../Developer";
import { TableView } from "../Table";
// import { GalleryView } from "../Gallery";

// getViewComponent returns the Svelte component for the selected view type.
// All built-in views have their own components, while custom views share
// the CustomView component.
export function getViewComponent(type: string) {
  const standardViewComponents: Record<string, any> = {
    table: TableView,
    board: BoardView,
    calendar: CalendarView,
    developer: DeveloperView,
    // gallery: GalleryView,
  };

  const standardComponent = standardViewComponents[type];

  if (standardComponent) {
    return standardComponent;
  }

  if (get(customViews)[type]) {
    return CustomView;
  }

  return null;
}
