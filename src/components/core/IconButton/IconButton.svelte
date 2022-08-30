<script lang="ts">
	import { setIcon } from "obsidian";

	export let icon: string;
	export let iconSize: number = 16;

	function useIcon(
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

<div use:useIcon={{ name: icon, size: iconSize }} on:click />

<style>
	div {
		margin: 0;
		padding: 2px;

		border-radius: var(--radius-s);
		display: flex;
		align-items: center;
		color: var(--text-muted);
	}

	div:hover {
		background-color: var(--background-modifier-hover);
		color: var(--text-normal);
	}
</style>
