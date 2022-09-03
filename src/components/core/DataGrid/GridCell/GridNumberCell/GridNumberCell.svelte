<script lang="ts">
	import GridCell from "../GridCell.svelte";
	import NumberLabel from "./NumberLabel.svelte";
	import NumberInput from "./NumberInput.svelte";
	import { isNumber } from "src/lib/data";
	import type { GridColDef } from "../../data-grid";

	export let value: number | undefined;
	export let onChange: (value: number) => void;
	export let column: GridColDef;
</script>

<GridCell {column} on:mousedown>
	<svelte:fragment slot="read">
		{#if isNumber(value)}
			<NumberLabel slot="read" {value} />
		{/if}
	</svelte:fragment>
	<NumberInput slot="edit" value={value ?? 0} {onChange} />
</GridCell>
