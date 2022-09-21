export interface ProjectView {
	setTitle(title: string): ProjectView;
	setIcon(icon: string): ProjectView;
	setNoPadding(): ProjectView;
	setOnOpen(cb: (data: any, contentEl: HTMLElement) => void): ProjectView;
}

export class Builder {
	title?: string;
	icon?: string;
	noPadding?: boolean;
	onOpen?: (data: any, contentEl: HTMLElement) => void;

	constructor() {}

	setTitle(title: string): Builder {
		this.title = title;
		return this;
	}

	setIcon(icon: string): Builder {
		this.icon = icon;
		return this;
	}

	setNoPadding() {
		this.noPadding = true;
		return this;
	}

	setOnOpen(cb: (data: any, contentEl: HTMLElement) => void) {
		this.onOpen = cb;
		return this;
	}
}
