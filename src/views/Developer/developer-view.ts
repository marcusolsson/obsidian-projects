import { ProjectViewV2 } from "src/custom-view-api";
import DeveloperViewSvelte from "./DeveloperView.svelte";

export class DeveloperView extends ProjectViewV2 {
  developer?: DeveloperViewSvelte;

  getViewType(): string {
    return "developer";
  }
  getDisplayName(): string {
    return "Developer";
  }
  getIcon(): string {
    return "wrench";
  }

  async onOpen() {
    this.developer = new DeveloperViewSvelte({
      target: this.contentEl,
    });
  }

  async onClose() {
    this.developer?.$destroy();
  }
}
