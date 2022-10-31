import { ProjectViewV2 } from "src/builder";
import type { DataFrame } from "src/lib/data";
import GalleryViewSvelte from "./GalleryView.svelte";
import type { GalleryConfig } from "./types";

export class GalleryView extends ProjectViewV2<GalleryConfig> {
  gallery?: GalleryViewSvelte;
  data?: DataFrame;

  getViewType(): string {
    return "gallery";
  }
  getDisplayName(): string {
    return "Gallery";
  }
  getIcon(): string {
    return "layout-grid";
  }

  async onData(data: DataFrame) {
    this.data = data;

    this.gallery?.$set({
      frame: this.data,
    });
  }

  async onOpen(config: GalleryConfig) {
    this.gallery = new GalleryViewSvelte({
      target: this.contentEl,
      props: {
        frame: this.data ?? { fields: [], records: [] },
        config: config,
        onConfigChange: (config) => {
          this.saveConfig(config);
        },
        api: this.viewApi,
      },
    });
  }

  async onClose() {
    this.gallery?.$destroy();
  }
}
