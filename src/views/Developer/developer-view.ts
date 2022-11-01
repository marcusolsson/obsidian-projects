import { ProjectView } from "src/custom-view-api";
import DeveloperViewSvelte from "./DeveloperView.svelte";

export class DeveloperView extends ProjectView {
  view?: DeveloperViewSvelte;

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
    this.view = new DeveloperViewSvelte({
      target: this.contentEl,
    });
  }

  async onClose() {
    this.view?.$destroy();
  }
}
