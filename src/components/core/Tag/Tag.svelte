<script lang="ts">
	import IconButton from "../IconButton/IconButton.svelte";

	export let value: string;
	export let deletable: boolean = false;
	export let onDelete: () => void = () => {};
</script>

<div>
	{value}
	{#if deletable}
		<IconButton icon="cross" iconSize={14} on:click={() => onDelete()} />
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
