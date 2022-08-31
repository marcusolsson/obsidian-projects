<script lang="ts">
	import GridCell from "../GridCell.svelte";
	import NumberLabel from "./NumberLabel.svelte";
	import NumberInput from "./NumberInput.svelte";
	import { isNumber } from "src/lib/datasource";

	export let value: number | undefined;
	export let width: number;

	export let onChange: (value: number) => void;
</script>

<GridCell {width} on:mousedown>
	<svelte:fragment slot="read">
		{#if isNumber(value)}
			<NumberLabel slot="read" {value} />
		{/if}
	</svelte:fragment>
	<NumberInput slot="edit" value={value ?? 0} {onChange} />
</GridCell>
