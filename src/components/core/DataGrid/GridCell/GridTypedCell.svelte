<script lang="ts">
	import {
		isOptionalBoolean,
		isOptionalDate,
		isOptionalLink,
		isOptionalNumber,
		isOptionalString,
		type DataFieldType,
		type DataValue,
	} from "src/lib/datasource";

	import GridCell from "./GridCell.svelte";

	import { GridBooleanCell } from "./GridBooleanCell";
	import { GridDateCell } from "./GridDateCell";
	import { GridNumberCell } from "./GridNumberCell";
	import { GridTextCell } from "./GridTextCell";

	export let value: DataValue;
	export let onChange: (value: DataValue) => void;
	export let type: DataFieldType;
	export let width: number;
	export let editable: boolean;
</script>

{#if type === "string" && isOptionalString(value)}
	<GridTextCell {value} {onChange} {width} {editable} on:mousedown />
{:else if type === "boolean" && isOptionalBoolean(value)}
	<GridBooleanCell {value} {onChange} {width} on:mousedown />
{:else if type === "number" && isOptionalNumber(value)}
	<GridNumberCell {value} {onChange} {width} on:mousedown />
{:else if type === "date" && isOptionalDate(value)}
	<GridDateCell {value} {onChange} {width} on:mousedown />
	<!-- {:else if type === "link" && isOptionalLink(value)}
	// TODO: Serialize and deserialize link objects.
	<GridLinkCell {value} {onChange} {width} on:mousedown /> -->
{:else}
	<GridCell {width} on:mousedown />
{/if}
