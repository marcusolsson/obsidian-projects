<script lang="ts">
	import type { DataFieldType, DataValue } from "src/lib/datasource";

	import GridCell from "./GridCell.svelte";

	import { GridBooleanCell } from "./GridBooleanCell";
	import { GridDateCell } from "./GridDateCell";
	import { GridLinkCell } from "./GridLinkCell";
	import { GridNumberCell } from "./GridNumberCell";
	import { GridTextCell } from "./GridTextCell";

	export let value: DataValue;
	export let onChange: (value: DataValue) => void;
	export let type: DataFieldType;
	export let width: number;
	export let editable: boolean;
</script>

{#if type === "string"}
	<GridTextCell {value} {onChange} {width} {editable} on:mousedown />
{:else if type === "boolean"}
	<GridBooleanCell {value} {onChange} {width} on:mousedown />
{:else if type === "number"}
	<GridNumberCell {value} {onChange} {width} on:mousedown />
{:else if type === "date"}
	<GridDateCell {value} {onChange} {width} on:mousedown />
{:else if type === "link"}
	<GridLinkCell {value} {onChange} {width} on:mousedown />
{:else}
	<GridCell {width} on:mousedown />
{/if}
