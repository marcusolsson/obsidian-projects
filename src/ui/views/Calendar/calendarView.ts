import {
  ProjectView,
  type DataQueryResult,
  type ProjectViewProps,
} from "src/customViewApi";

import CalendarViewSvelte from "./CalendarView.svelte";
import type { CalendarConfig } from "./types";

export class CalendarView extends ProjectView<CalendarConfig> {
  view?: CalendarViewSvelte | null;
  props?: ProjectViewProps;

  getViewType(): string {
    return "calendar";
  }
  getDisplayName(): string {
    return "Calendar";
  }
  getIcon(): string {
    return "calendar";
  }

  async onData({ data }: DataQueryResult) {
    this.view?.$set({ frame: data });
  }

  async onOpen(props: ProjectViewProps<CalendarConfig>) {
    this.view = new CalendarViewSvelte({
      target: props.contentEl,
      props: {
        frame: { fields: [], records: [] },
        api: props.viewApi,
        project: props.project,
        readonly: props.readonly,
        config: props.config,
        onConfigChange: props.saveConfig,
        getRecordColor: props.getRecordColor,
      },
    });
  }

  async onClose() {
    this.view?.$destroy();
    this.view = null;
  }
}
