<script lang="ts">
	import { DateInput } from "obsidian-svelte";

	import { GridCell } from "..";
	import { TextLabel } from "..";
	import type { GridColDef } from "../../data-grid";

	export let value: Date | undefined;
	export let onChange: (value: Date) => void;
	export let column: GridColDef;
	export let colindex: number;

	let edit = false;
</script>

<GridCell
	{colindex}
	{edit}
	onEditChange={(mode) => {
		edit = mode;
	}}
	{column}
	on:mousedown
	onCopy={() => {
		if (value) {
			navigator.clipboard.writeText(value.toLocaleDateString());
		}
	}}
>
	<svelte:fragment slot="read">
		{#if value}
			<TextLabel value={value.toLocaleDateString()} />
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="edit">
		<DateInput
			value={value ?? null}
			on:change={({ detail: value }) => {
				edit = false;
				onChange(value);
			}}
			embed
		/>
	</svelte:fragment>
</GridCell>
