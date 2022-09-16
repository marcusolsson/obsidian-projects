<script lang="ts">
	import { isBoolean } from "src/lib/data";
	import { Checkbox } from "../../../../core/Checkbox";
	import { GridCell } from "../";
	import type { GridColDef } from "../../data-grid";

	export let value: boolean | undefined;
	export let onChange: (value: boolean) => void;
	export let column: GridColDef;
</script>

<GridCell {column} on:mousedown>
	<svelte:fragment slot="read">
		{#if isBoolean(value)}
			<Checkbox {value} {onChange} />
		{/if}
	</svelte:fragment>
	<Checkbox slot="edit" value={value ?? false} {onChange} />
</GridCell>
