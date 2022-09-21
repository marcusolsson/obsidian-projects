<script lang="ts">
	import { useIcon } from "./useIcon";

	/**
	 * Specifies the icon identifier. Visit https://lucide.dev for all valid
	 * identifiers.
	 */
	export let icon: string;

	/**
	 * Specifies the width and height of the icon in pixels. Defaults to 16px.
	 */
	export let size: number = 16;
</script>

<div
	style={`width: ${size + 4}px; height: ${size + 4}px`}
	use:useIcon={{ name: icon, size }}
	on:click
/>

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
