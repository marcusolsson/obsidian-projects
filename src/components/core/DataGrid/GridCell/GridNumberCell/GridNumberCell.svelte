<script lang="ts">
	import GridCell from "../GridCell.svelte";
	import NumberLabel from "./NumberLabel.svelte";
	import NumberInput from "./NumberInput.svelte";
	import { isNumber, type DataValue } from "src/lib/datasource";

	export let value: DataValue;
	export let width: number;

	export let onChange: (value: number) => void;
</script>

{#if isNumber(value)}
	<GridCell {width} on:mousedown>
		<NumberLabel slot="read" {value} />
		<NumberInput slot="edit" {value} {onChange} />
	</GridCell>
{:else}
	<GridCell {width} on:mousedown>
		<NumberInput slot="edit" value={0} {onChange} />
	</GridCell>
{/if}
