<script lang="ts">
	import { isDate } from "src/lib/data";

	import { DatePicker } from "../../../../core/DatePicker";

	import { GridCell } from "../";
	import { TextLabel } from "../";
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
		<DatePicker
			value={value ?? null}
			onCommit={(value) => {
				console.log(value);
				edit = false;
				onChange(value);
			}}
			embed
		/>
	</svelte:fragment>
</GridCell>
