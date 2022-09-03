<script lang="ts">
	import { isBoolean } from "src/lib/data";
	import { Checkbox } from "../../../../core/Checkbox";
	import { GridCell } from "../";

	export let value: boolean | undefined;
	export let width: number;

	export let onChange: (value: boolean) => void;
</script>

<GridCell {width} on:mousedown>
	<svelte:fragment slot="read">
		{#if isBoolean(value)}
			<Checkbox slot="read" {value} {onChange} />
		{/if}
	</svelte:fragment>
	<Checkbox slot="edit" value={value ?? false} {onChange} />
</GridCell>
