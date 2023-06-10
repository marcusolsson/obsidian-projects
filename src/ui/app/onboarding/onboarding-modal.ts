import { App, Modal } from "obsidian";

import Onboarding from "./Onboarding.svelte";

export class OnboardingModal extends Modal {
  component?: Onboarding;

  constructor(
    readonly app: App,
    readonly onCreate: () => void,
    readonly onTry: () => void
  ) {
    super(app);
  }

  onOpen() {
    this.component = new Onboarding({
      target: this.contentEl,
      props: {
        onCreate: () => {
          this.onCreate();
          this.close();
        },
        onTry: () => {
          this.onTry();
          this.close();
        },
      },
    });
  }
}
