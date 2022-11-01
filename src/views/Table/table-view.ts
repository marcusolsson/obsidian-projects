import { ProjectView } from "src/custom-view-api";
import type { DataFrame } from "src/lib/data";
import TableViewSvelte from "./TableView.svelte";
import type { GridConfig } from "./types";

export class TableView extends ProjectView<GridConfig> {
  view?: TableViewSvelte;
  data?: DataFrame;

  getViewType(): string {
    return "table";
  }
  getDisplayName(): string {
    return "Table";
  }
  getIcon(): string {
    return "table";
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

  async onOpen(config: GridConfig) {
    this.view = new TableViewSvelte({
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
