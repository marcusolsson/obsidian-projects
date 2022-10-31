import { ProjectViewV2 } from "src/custom-view-api";
import type { DataFrame } from "src/lib/data";
import BoardViewSvelte from "./BoardView.svelte";
import type { BoardConfig } from "./types";

export class BoardView extends ProjectViewV2<BoardConfig> {
  view?: BoardViewSvelte;
  data?: DataFrame;

  getViewType(): string {
    return "board";
  }
  getDisplayName(): string {
    return "Board";
  }
  getIcon(): string {
    return "columns";
  }

  async onData(data: DataFrame) {
    this.data = data;

    this.view?.$set({
      frame: this.data,
      api: this.viewApi,
      project: this.project,
      readonly: this.readonly,
    });
  }

  async onOpen(config: BoardConfig) {
    this.view = new BoardViewSvelte({
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
