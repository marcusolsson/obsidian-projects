import {
  ProjectView,
  type DataQueryResult,
  type ProjectViewProps,
} from "src/custom-view-api";
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

  async onOpen({
    contentEl,
    config,
    saveConfig,
  }: ProjectViewProps<GridConfig>) {
    if (this.dataProps) {
      this.view = new TableViewSvelte({
        target: contentEl,
        props: {
          config,
          onConfigChange: saveConfig,
          frame: this.dataProps.data ?? { fields: [], records: [] },
          api: this.dataProps.viewApi,
          project: this.dataProps.project,
          readonly: this.dataProps.readonly,
        },
      });
    }
  }

  async onClose() {
    this.view?.$destroy();
  }
}
