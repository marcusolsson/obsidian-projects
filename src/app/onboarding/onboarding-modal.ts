import { App, Modal } from "obsidian";
import Onboarding from "./Onboarding.svelte";

export class OnboardingModal extends Modal {
	// @ts-expect-error
	component: Onboarding;

	onCreate: () => void;
	onTry: () => void;

	constructor(app: App, onCreate: () => void, onTry: () => void) {
		super(app);

		this.onCreate = onCreate;
		this.onTry = onTry;
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
