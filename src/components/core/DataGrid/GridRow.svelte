<script lang="ts">
	import produce from "immer";
	import type { Menu } from "obsidian";

	import { GridCell, GridTypedCell, TextLabel } from "./GridCell";
	import { DataFieldType, type DataValue } from "src/lib/data";
	import { IconButton } from "../IconButton";
	import GridCellGroup from "./GridCellGroup.svelte";

	import type { GridColDef, GridRowId, GridRowModel } from "./data-grid";

	export let rowId: GridRowId;
	export let index: number;
	export let row: GridRowModel;
	export let columns: GridColDef[];

	export let onRowChange: (rowId: GridRowId, row: GridRowModel) => void;
	export let onRowMenu: (rowId: GridRowId, row: GridRowModel) => Menu;
	export let onCellMenu: (
		rowId: GridRowId,
		column: GridColDef,
		value: DataValue
	) => Menu;
	export let onNavigate: (event: MouseEvent) => void;

	function handleHeaderClick(): (event: MouseEvent) => void {
		return (event: MouseEvent) => {
			if (event.button === 2) {
				onRowMenu(rowId, row).showAtMouseEvent(event);
			}
		};
	}

	function handleCellClick(
		column: GridColDef,
		value: DataValue
	): (event: MouseEvent) => void {
		return (event: MouseEvent) => {
			if (event.button === 2) {
				onCellMenu(rowId, column, value).showAtMouseEvent(event);
			}

			if (event.target instanceof HTMLTableCellElement) {
				if (event.target.firstChild instanceof HTMLInputElement) {
					event.target.firstChild.focus();
					event.preventDefault();
				}
			}
		};
	}
</script>

<GridCellGroup>
	<GridCell header width={60} on:mousedown={handleHeaderClick()}>
		<TextLabel slot="read" value={index.toString()} />
		<IconButton slot="hover" icon="go-to-file" on:click={onNavigate} />
	</GridCell>

	{#each columns as column}
		<GridTypedCell
			value={row[column.field]}
			type={column.type ?? DataFieldType.Unknown}
			width={column.width ?? 180}
			editable={column.editable ?? false}
			onChange={(value) => {
				onRowChange(
					rowId,
					produce(row, (draft) => {
						draft[column.field] = value;
						return draft;
					})
				);
			}}
			on:mousedown={handleCellClick(column, row[column.field])}
		/>
	{/each}
</GridCellGroup>
