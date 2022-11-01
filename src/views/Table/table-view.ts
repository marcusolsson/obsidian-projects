import {
  ProjectView,
  type DataQueryResult,
  type ProjectViewProps,
} from "src/custom-view-api";
import TableViewSvelte from "./TableView.svelte";
import type { GridConfig } from "./types";

export class TableView extends ProjectView<GridConfig> {
  view?: TableViewSvelte;
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

  async onData(result: DataQueryResult) {
    if (!this.view && this.props) {
      this.view = new TableViewSvelte({
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

  async onOpen(props: ProjectViewProps<GridConfig>) {
    this.props = props;
  }

  async onClose() {
    this.view?.$destroy();
  }
}
