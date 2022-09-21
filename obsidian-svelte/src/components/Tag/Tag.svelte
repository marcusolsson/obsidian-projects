<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import { IconButton } from "obsidian-svelte";

	/**
	 * Specifies the tag value.
	 */
	export let value: string;

	/**
	 * Specifies whether the tag can be deleted.
	 */
	export let deletable: boolean = false;

	const dispatch = createEventDispatcher<{ delete: void }>();
</script>

<div>
	{value}
	{#if deletable}
		<IconButton
			icon="cross"
			size={14}
			on:click={() => dispatch("delete")}
		/>
	{/if}
</div>

<style>
	div {
		background-color: var(--tag-background);
		border: var(--tag-border-width) solid var(--tag-border-color);
		border-radius: var(--tag-radius);
		color: var(--tag-color);
		font-size: var(--tag-size);
		text-decoration: var(--tag-decoration);
		padding: var(--tag-padding-y) var(--tag-padding-x);
		line-height: 1;

		display: inline-flex;
		align-items: center;
	}
</style>
