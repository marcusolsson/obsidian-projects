import { ProjectView, type ProjectViewProps } from "src/custom-view-api";

import DeveloperViewSvelte from "./DeveloperView.svelte";

export class DeveloperView extends ProjectView {
  view?: DeveloperViewSvelte | null;

  getViewType(): string {
    return "developer";
  }
  getDisplayName(): string {
    return "Developer";
  }
  getIcon(): string {
    return "wrench";
  }

  async onOpen({ contentEl }: ProjectViewProps) {
    this.view = new DeveloperViewSvelte({
      target: contentEl,
    });
  }

  async onClose() {
    this.view?.$destroy();
    this.view = null;
  }
}
