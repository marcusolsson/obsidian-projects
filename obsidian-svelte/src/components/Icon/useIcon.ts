import { setIcon } from "obsidian";

/**
 * Mounts an Obsidian icon to an HTML element.
 */
export function useIcon(node: HTMLElement, name: string) {
	setIcon(node, name);

	return {
		update(name: string) {
			setIcon(node, name);
		},
	};
}
