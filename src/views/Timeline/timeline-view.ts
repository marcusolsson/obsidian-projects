import {
  ProjectView,
  type DataQueryResult,
  type ProjectViewProps,
} from "src/custom-view-api";
import TimelineViewSvelte from "./TimelineView.svelte";
import type { TimelineConfig } from "./types";

export class TimelineView extends ProjectView<TimelineConfig> {
  view?: TimelineViewSvelte | null;
  props?: ProjectViewProps;

  getViewType(): string {
    return "timeline";
  }
  getDisplayName(): string {
    return "Timeline";
  }
  getIcon(): string {
    return "align-vertical-distribute-center";
  }
  async onData({ data }: DataQueryResult): Promise<void> {
    this.view?.$set({ frame: data });
  }
  async onOpen(props: ProjectViewProps<TimelineConfig>) {
    this.view = new TimelineViewSvelte({
      target: props.contentEl,
      props: {
        frame: { fields: [], records: [] },
        api: props.viewApi,
        project: props.project,
        readonly: props.readonly,
        config: props.config,
        onConfigChange: props.saveConfig,
      },
    });
  }
  async onClose() {
    this.view?.$destroy();
    this.view = null;
  }
}
