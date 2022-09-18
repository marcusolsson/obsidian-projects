<script lang="ts">
	import GridCell from "../GridCell.svelte";
	import NumberLabel from "./NumberLabel.svelte";
	import NumberInput from "./NumberInput.svelte";
	import { isNumber } from "src/lib/types";
	import type { GridColDef } from "../../data-grid";

	export let value: number | undefined;
	export let onChange: (value: number) => void;
	export let column: GridColDef;

	let edit = false;
</script>

<GridCell {edit} onEditChange={(value) => (edit = value)} {column} on:mousedown>
	<svelte:fragment slot="read">
		{#if isNumber(value)}
			<NumberLabel {value} />
		{/if}
	</svelte:fragment>
	<NumberInput
		slot="edit"
		value={value ?? 0}
		onChange={(value) => {
			onChange(value);
		}}
		onBlur={() => {
			edit = false;
		}}
	/>
</GridCell>
