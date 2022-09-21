<script lang="ts">
	import { isDate } from "../../../../../lib/types";

	import { DateInput } from "obsidian-svelte";

	import { GridCell } from "..";
	import { TextLabel } from "..";
	import type { GridColDef } from "../../data-grid";

	export let value: Date | undefined;
	export let onChange: (value: Date) => void;
	export let column: GridColDef;

	let edit = false;
</script>

<GridCell
	{edit}
	onEditChange={(mode) => {
		edit = mode;
	}}
	{column}
	on:mousedown
>
	<svelte:fragment slot="read">
		{#if isDate(value)}
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
