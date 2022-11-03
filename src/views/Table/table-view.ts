import {
  ProjectView,
  type DataQueryResult,
  type ProjectViewProps,
} from "src/custom-view-api";
import TableViewSvelte from "./TableView.svelte";
import type { TableConfig } from "./types";

export class TableView extends ProjectView<TableConfig> {
  view?: TableViewSvelte | null;
  props?: ProjectViewProps;

  getViewType(): string {
    return "table";
  }
  getDisplayName(): string {
    return "Table";
  }
  getIcon(): string {
    return "table";
  }

  async onData({ data }: DataQueryResult) {
    this.view?.$set({ frame: data });
  }

  async onOpen(props: ProjectViewProps<TableConfig>) {
    this.view = new TableViewSvelte({
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
