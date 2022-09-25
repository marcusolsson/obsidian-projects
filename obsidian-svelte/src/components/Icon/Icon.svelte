<script lang="ts">
	import { useIcon } from "./useIcon";

	/**
	 * Specifies the icon identifier. Visit https://lucide.dev for all valid
	 * identifiers.
	 */
	export let name: string;

	/**
	 * Specifies the width and height of the icon in pixels. Defaults to 16px.
	 */
	export let size: number = 16;

	/**
	 * Specifies whether to invert the icon color on accent backgrounds.
	 */
	export let accent: boolean = false;

	/**
	 * Specifies the tooltip text.
	 */
	export let tooltip: string = "";
</script>

<span
	style={`width: ${size}px; height: ${size}px`}
	class:accent
	use:useIcon={{ name, size }}
	aria-label={tooltip}
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
