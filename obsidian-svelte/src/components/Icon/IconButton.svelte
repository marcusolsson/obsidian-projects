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

	/**
	 * Specifies whether icon is active.
	 */
	export let active: boolean = false;

	/**
	 * Specifies the tooltip.
	 */
	export let tooltip: string = "";

	/**
	 * Specifies whether to remove the default padding.
	 */
	export let nopadding: boolean = false;
</script>

<div
	class:nopadding
	class:is-active={active}
	class="clickable-icon"
	use:useIcon={{ name: icon, size }}
	on:click
	aria-label={tooltip}
/>

<style>
	.nopadding {
		padding: 0;
	}
</style>
