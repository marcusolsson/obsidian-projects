import { ProjectView, type DataQueryResult } from "src/custom-view-api";
import GalleryViewSvelte from "./GalleryView.svelte";
import type { GalleryConfig } from "./types";

export class GalleryView extends ProjectView<GalleryConfig> {
  view?: GalleryViewSvelte;
  queryResult?: DataQueryResult;

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
    this.queryResult = result;

    this.view?.$set({
      frame: result.data,
      api: result.viewApi,
    });
  }

  async onOpen(config: GalleryConfig) {
    if (this.queryResult) {
      this.view = new GalleryViewSvelte({
        target: this.contentEl,
        props: {
          frame: this.queryResult.data ?? { fields: [], records: [] },
          api: this.queryResult.viewApi,
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
