<script lang="ts">
	import { isBoolean } from "../../../../../../../lib/types";
	import { Checkbox } from "obsidian-svelte";
	import { GridCell } from "..";
	import type { GridColDef } from "../../data-grid";

	export let value: boolean | undefined;
	export let onChange: (value: boolean) => void;
	export let column: GridColDef;
</script>

<GridCell {column} on:mousedown>
	<svelte:fragment slot="read">
		{#if isBoolean(value)}
			<Checkbox
				checked={value}
				on:check={({ detail: checked }) => onChange(checked)}
				disabled={!column.editable}
			/>
		{/if}
	</svelte:fragment>
	<Checkbox
		slot="edit"
		checked={value ?? false}
		on:check={({ detail: checked }) => onChange(checked)}
	/>
</GridCell>
