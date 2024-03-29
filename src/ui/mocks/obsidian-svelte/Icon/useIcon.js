import { setIcon } from "obsidian";
/**
 * Mounts an Obsidian icon to an HTML element.
 */
export function useIcon(node, name) {
    setIcon(node, name);
    return {
        update(name) {
            setIcon(node, name);
        },
    };
}
