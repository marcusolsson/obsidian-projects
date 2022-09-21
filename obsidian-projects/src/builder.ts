export class Builder {
	title?: string;
	noPadding?: boolean;
	onOpen?: (data: any, contentEl: HTMLElement) => void;

	constructor() {}

	setTitle(title: string): Builder {
		this.title = title;
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
