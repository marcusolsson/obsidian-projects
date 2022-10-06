<script lang="ts">
	import Popover from "./Popover.svelte";

	/**
	 * Specifies the element to anchor the menu to.
	 */
	export let anchorEl: HTMLElement;

	/**
	 * Specifies whether the menu is open or not.
	 */
	export let open: boolean;

	/**
	 * Specifices where to place the menu in relation to the anchor element.
	 */
	export let placement:
		| "auto"
		| "auto-start"
		| "auto-end"
		| "top"
		| "bottom"
		| "right"
		| "left"
		| "top-start"
		| "top-end"
		| "bottom-start"
		| "bottom-end"
		| "right-start"
		| "right-end"
		| "left-start"
		| "left-end" = "bottom-start";
</script>

<Popover
	{anchorEl}
	{open}
	{placement}
	className="suggestion-container"
	on:close
>
	<div class="suggestion" style="max-height: 300px;">
		<slot />
	</div>
</Popover>
