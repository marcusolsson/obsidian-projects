import {
  ProjectView,
  type DataQueryResult,
  type ProjectViewProps,
} from "src/custom-view-api";
import BoardViewSvelte from "./BoardView.svelte";
import type { BoardConfig } from "./types";

export class BoardView extends ProjectView<BoardConfig> {
  view?: BoardViewSvelte;
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

  async onData(result: DataQueryResult) {
    if (!this.view && this.props) {
      this.view = new BoardViewSvelte({
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

  async onOpen(props: ProjectViewProps<BoardConfig>) {
    this.props = props;
  }

  async onClose() {
    this.view?.$destroy();
  }
}
