<script lang="ts">
	import { IconButton, Tag } from "obsidian-svelte";
	import { InputDialogModal } from "obsidian-projects/src/modals/input-dialog";
	import { app } from "obsidian-projects/src/lib/stores/obsidian";

	export let values: string[];
	export let edit: boolean;

	export let onChange: (values: string[]) => void = () => {};
</script>

<div class:edit>
	{#if edit}
		{#each values as value, i}
			<Tag
				{value}
				deletable
				on:delete={() => {
					onChange(values.filter((_, j) => i !== j));
				}}
			/>
		{/each}
		<IconButton
			icon="plus"
			on:click={() => {
				new InputDialogModal($app, "Add list item", "Add", (value) => {
					onChange([...values, value]);
				}).open();
			}}
		/>
	{:else}
		{#each values as value}
			<Tag {value} />
		{/each}
	{/if}
</div>

<style>
	div {
		display: flex;
		align-items: center;
		gap: 4px;
		overflow: hidden;
		padding: 4px;
	}

	.edit {
		flex-wrap: wrap;
	}
</style>
