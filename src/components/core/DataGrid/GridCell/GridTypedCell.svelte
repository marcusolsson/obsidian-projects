<script lang="ts">
	import {
		isOptionalBoolean,
		isOptionalDate,
		isOptionalNumber,
		isOptionalString,
		type DataValue,
	} from "src/lib/data";

	import GridCell from "./GridCell.svelte";

	import type { GridColDef } from "../data-grid";
	import { GridBooleanCell } from "./GridBooleanCell";
	import { GridDateCell } from "./GridDateCell";
	import { GridNumberCell } from "./GridNumberCell";
	import { GridTextCell } from "./GridTextCell";

	export let value: DataValue;
	export let onChange: (value: DataValue) => void;
	export let column: GridColDef;
</script>

{#if column.type === "string" && isOptionalString(value)}
	<GridTextCell {value} {onChange} {column} on:mousedown />
{:else if column.type === "boolean" && isOptionalBoolean(value)}
	<GridBooleanCell {value} {onChange} {column} on:mousedown />
{:else if column.type === "number" && isOptionalNumber(value)}
	<GridNumberCell {value} {onChange} {column} on:mousedown />
{:else if column.type === "date" && isOptionalDate(value)}
	<GridDateCell {value} {onChange} {column} on:mousedown />
	<!-- {:else if type === "link" && isOptionalLink(value)}
	// TODO: Serialize and deserialize link objects.
	<GridLinkCell {value} {onChange} {width} on:mousedown /> -->
{:else}
	<GridCell {column} on:mousedown />
{/if}
