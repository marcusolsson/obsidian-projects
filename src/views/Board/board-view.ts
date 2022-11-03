import {
  ProjectView,
  type DataQueryResult,
  type ProjectViewProps,
} from "src/custom-view-api";
import BoardViewSvelte from "./BoardView.svelte";
import type { BoardConfig } from "./types";

export class BoardView extends ProjectView<BoardConfig> {
  view?: BoardViewSvelte | null;
  props?: ProjectViewProps;

  getViewType(): string {
    return "board";
  }
  getDisplayName(): string {
    return "Board";
  }
  getIcon(): string {
    return "columns";
  }

  async onData({ data }: DataQueryResult) {
    this.view?.$set({ frame: data });
  }

  async onOpen(props: ProjectViewProps<BoardConfig>) {
    this.view = new BoardViewSvelte({
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
