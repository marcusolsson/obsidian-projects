<script lang="ts">
	import { isBoolean } from "../../../../../../lib/data";
	import { Switch } from "obsidian-svelte";
	import { GridCell } from "..";
	import type { GridColDef } from "../../data-grid";

	export let value: boolean | undefined;
	export let onChange: (value: boolean) => void;
	export let column: GridColDef;
	export let rowindex: number;
	export let colindex: number;
	export let selected: boolean;
</script>

<GridCell {selected} {rowindex} {colindex} {column} on:mousedown on:navigate>
	<svelte:fragment slot="read">
		{#if isBoolean(value)}
			<Switch
				checked={value}
				on:check={({ detail: checked }) => onChange(checked)}
				disabled={!column.editable}
			/>
		{/if}
	</svelte:fragment>
	<Switch
		slot="edit"
		checked={value ?? false}
		on:check={({ detail: checked }) => onChange(checked)}
	/>
</GridCell>
