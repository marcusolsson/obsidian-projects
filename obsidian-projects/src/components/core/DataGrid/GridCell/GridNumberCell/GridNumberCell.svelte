<script lang="ts">
	import GridCell from "../GridCell.svelte";
	import NumberLabel from "./NumberLabel.svelte";
	import NumberInput from "./NumberInput.svelte";
	import { isNumber } from "../../../../../lib/types";
	import type { GridColDef } from "../../data-grid";

	export let value: number | undefined;
	export let onChange: (value: number) => void;
	export let column: GridColDef;

	let edit: boolean = false;
	let selected: boolean = false;
</script>

<GridCell bind:edit bind:selected {column} on:mousedown>
	<svelte:fragment slot="read">
		{#if isNumber(value)}
			<NumberLabel {value} />
		{/if}
	</svelte:fragment>
	<NumberInput
		slot="edit"
		on:blur={() => {
			selected = false;
			edit = false;
		}}
		value={value ?? 0}
		onChange={(value) => {
			onChange(value);
		}}
	/>
</GridCell>
