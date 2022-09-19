<script lang="ts">
	import { setIcon } from "obsidian";

	export let name: string;
	export let size: number = 16;
	export let accent: boolean = false;

	function icon(
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
</script>

<span
	style={`width: ${size}px; height: ${size}px`}
	class:accent
	use:icon={{ name, size }}
/>

<style>
	span {
		color: var(--text-muted);
		fill: var(--text-muted);
	}

	.accent {
		color: var(--text-on-accent);
		fill: var(--text-on-accent);
	}
</style>
