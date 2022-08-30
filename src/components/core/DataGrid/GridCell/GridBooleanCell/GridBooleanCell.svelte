<script lang="ts">
	import { isBoolean, type DataValue } from "src/lib/datasource";

	import { Checkbox } from "../../../../core/Checkbox";
	import { GridCell } from "../";

	export let value: DataValue;
	export let width: number;

	export let onChange: (value: boolean) => void;
</script>

{#if isBoolean(value)}
	<GridCell {width} on:mousedown>
		<Checkbox slot="read" {value} {onChange} />
		<Checkbox slot="edit" {value} {onChange} />
	</GridCell>
{:else}
	<GridCell {width} on:mousedown>
		<Checkbox slot="edit" value={false} {onChange} />
	</GridCell>
{/if}
