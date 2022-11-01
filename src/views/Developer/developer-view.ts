import { ProjectView } from "src/custom-view-api";
import DeveloperViewSvelte from "./DeveloperView.svelte";

export class DeveloperView extends ProjectView {
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
