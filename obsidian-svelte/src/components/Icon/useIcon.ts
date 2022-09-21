import { setIcon } from "obsidian";

/**
 * Mounts an Obsidian icon to an HTML element.
 */
export function useIcon(
	node: HTMLElement,
	{ name, size }: { name: string; size: number }
) {
	setIcon(node, name, size);

	return {
		update({ name, size }: { name: string; size: number }) {
			setIcon(node, name, size);
		},
	};
}
