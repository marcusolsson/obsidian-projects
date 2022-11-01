import { ProjectView, type DataQueryResult } from "src/custom-view-api";
import CalendarViewSvelte from "./CalendarView.svelte";
import type { CalendarConfig } from "./types";

export class CalendarView extends ProjectView<CalendarConfig> {
  view?: CalendarViewSvelte;
  queryResult?: DataQueryResult;

  getViewType(): string {
    return "calendar";
  }
  getDisplayName(): string {
    return "Calendar";
  }
  getIcon(): string {
    return "calendar";
  }

  async onData(result: DataQueryResult) {
    this.queryResult = result;

    this.view?.$set({
      frame: result.data,
      api: result.viewApi,
      project: result.project,
      readonly: result.readonly,
    });
  }

  async onOpen(config: CalendarConfig) {
    if (this.queryResult) {
      this.view = new CalendarViewSvelte({
        target: this.contentEl,
        props: {
          frame: this.queryResult.data ?? { fields: [], records: [] },
          api: this.queryResult.viewApi,
          project: this.queryResult.project,
          readonly: this.queryResult.readonly,
          config: config,
          onConfigChange: this.saveConfig.bind(this),
        },
      });
    }
  }

  async onClose() {
    this.view?.$destroy();
  }
}
