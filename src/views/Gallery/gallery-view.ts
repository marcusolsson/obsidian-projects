import {
  ProjectView,
  type DataQueryResult,
  type ProjectViewProps,
} from "src/custom-view-api";
import GalleryViewSvelte from "./GalleryView.svelte";
import type { GalleryConfig } from "./types";

export class GalleryView extends ProjectView<GalleryConfig> {
  view?: GalleryViewSvelte;
  props?: ProjectViewProps;

  getViewType(): string {
    return "gallery";
  }
  getDisplayName(): string {
    return "Gallery";
  }
  getIcon(): string {
    return "layout-grid";
  }

  async onData(result: DataQueryResult) {
    if (!this.view && this.props) {
      this.view = new GalleryViewSvelte({
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

  async onOpen(props: ProjectViewProps<GalleryConfig>) {
    this.props = props;
  }

  async onClose() {
    this.view?.$destroy();
  }
}
