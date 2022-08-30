<script lang="ts">
	import { setIcon } from "obsidian";

	export let icon: string;
	export let iconSize: number = 16;

	function useIcon(node: HTMLElement, name: string) {
		setIcon(node, name, iconSize);
	}
</script>

<div class="custom-icon" use:useIcon={icon} on:click />

<style>
	div {
		border-radius: 9999px;
		margin: 0;
		padding: var(--spacing-xs);
		background: none;
		display: flex;
		align-items: center;
	}

	div:hover {
		background-color: var(--background-primary);
		cursor: pointer;
	}

	.custom-icon {
		fill: var(--text-faint);
	}
</style>
