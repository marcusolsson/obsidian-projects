import {
  ProjectView,
  type DataQueryResult,
  type ProjectViewProps,
} from "src/custom-view-api";
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

  async onData(result: DataQueryResult) {
    if (!this.view && this.props) {
      this.view = new CalendarViewSvelte({
        target: this.props.contentEl,
        props: {
          frame: result.data ?? { fields: [], records: [] },
          api: result.viewApi,
          project: result.project,
          readonly: result.readonly,
          config: this.props.config,
          onConfigChange: this.props.saveConfig,
        },
      });
    } else {
      this.view?.$set({
        frame: result.data,
        api: result.viewApi,
        project: result.project,
        readonly: result.readonly,
      });
    }
  }

  async onOpen(props: ProjectViewProps<CalendarConfig>) {
    this.props = props;
  }

  async onClose() {
    this.view?.$destroy();
    this.view = null;
  }
}
