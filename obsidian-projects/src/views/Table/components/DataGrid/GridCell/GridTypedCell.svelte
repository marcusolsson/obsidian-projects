<script lang="ts">
	import {
		isOptionalBoolean,
		isOptionalDate,
		isOptionalLink,
		isOptionalList,
		isOptionalNumber,
		isOptionalString,
		type DataValue,
	} from "../../../../../lib/types";

	import GridCell from "./GridCell.svelte";

	import type { GridColDef } from "../data-grid";
	import { GridBooleanCell } from "./GridBooleanCell";
	import { GridDateCell } from "./GridDateCell";
	import { GridNumberCell } from "./GridNumberCell";
	import { GridTextCell } from "./GridTextCell";
	import { GridLinkCell } from "./GridLinkCell";
	import { GridListCell } from "./GridListCell";

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
{:else if column.type === "link" && isOptionalLink(value)}
	<GridLinkCell {value} {onChange} {column} on:mousedown />
{:else if column.type === "list" && isOptionalList(value)}
	<GridListCell {value} {onChange} {column} on:mousedown />
{:else}
	<GridCell {column} on:mousedown />
{/if}
