import { ProjectViewV2 } from "src/custom-view-api";
import type { DataFrame } from "src/lib/data";
import CalendarViewSvelte from "./CalendarView.svelte";
import type { CalendarConfig } from "./types";

export class CalendarView extends ProjectViewV2<CalendarConfig> {
  view?: CalendarViewSvelte;
  data?: DataFrame;

  getViewType(): string {
    return "calendar";
  }
  getDisplayName(): string {
    return "Calendar";
  }
  getIcon(): string {
    return "calendar";
  }

  async onData(data: DataFrame) {
    this.data = data;

    this.view?.$set({
      frame: this.data,
    });
  }

  async onOpen(config: CalendarConfig) {
    this.view = new CalendarViewSvelte({
      target: this.contentEl,
      props: {
        frame: this.data ?? { fields: [], records: [] },
        config: config,
        onConfigChange: this.saveConfig.bind(this),
        api: this.viewApi,
        project: this.project,
        readonly: this.readonly,
      },
    });
  }

  async onClose() {
    this.view?.$destroy();
  }
}
