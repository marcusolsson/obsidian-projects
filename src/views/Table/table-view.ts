import { ProjectView, type DataQueryResult } from "src/custom-view-api";
import TableViewSvelte from "./TableView.svelte";
import type { GridConfig } from "./types";

export class TableView extends ProjectView<GridConfig> {
  view?: TableViewSvelte;
  dataProps?: DataQueryResult;

  getViewType(): string {
    return "table";
  }
  getDisplayName(): string {
    return "Table";
  }
  getIcon(): string {
    return "table";
  }

  async onData(result: DataQueryResult) {
    this.dataProps = result;

    this.view?.$set({
      frame: result.data,
      api: result.viewApi,
      project: result.project,
      readonly: result.readonly,
    });
  }

  async onOpen(config: GridConfig) {
    if (this.dataProps) {
      this.view = new TableViewSvelte({
        target: this.contentEl,
        props: {
          frame: this.dataProps.data ?? { fields: [], records: [] },
          api: this.dataProps.viewApi,
          project: this.dataProps.project,
          readonly: this.dataProps.readonly,
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
