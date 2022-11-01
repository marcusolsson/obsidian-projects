import { ProjectView, type DataQueryResult } from "src/custom-view-api";
import BoardViewSvelte from "./BoardView.svelte";
import type { BoardConfig } from "./types";

export class BoardView extends ProjectView<BoardConfig> {
  view?: BoardViewSvelte;
  queryResult?: DataQueryResult;

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
    this.queryResult = result;

    this.view?.$set({
      frame: result.data,
      api: result.viewApi,
      project: result.project,
      readonly: result.readonly,
    });
  }

  async onOpen(config: BoardConfig) {
    if (this.queryResult) {
      this.view = new BoardViewSvelte({
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
