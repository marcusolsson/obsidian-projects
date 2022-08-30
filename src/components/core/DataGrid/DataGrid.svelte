<script lang="ts">
	import produce from "immer";

	import { Menu } from "obsidian";
	import type { DataValue } from "src/lib/datasource";
	import GridHeader from "./GridHeader.svelte";

	import GridRow from "./GridRow.svelte";

	import type {
		GridColDef,
		GridRowId,
		GridRowModel,
		GridRowProps,
		GridSortModel,
	} from "./types";

	export let columns: GridColDef[];
	export let rows: GridRowProps[];
	export let sortModel: GridSortModel;

	export let onSortModelChange: (field: string, sort: string) => void;
	export let onColumnResize: (field: string, width: number) => void;
	export let onRowChange: (rowId: GridRowId, row: GridRowModel) => void;
	export let onRowNavigate: (
		rowId: GridRowId,
		row: GridRowModel,
		openNew: boolean
	) => void;
	export let onColumnDelete: (field: string) => void;
	export let onRowDelete: (rowId: GridRowId) => void;
	export let onRowEdit: (rowId: GridRowId, row: GridRowModel) => void;

	function sortRows(
		rows: GridRowProps[],
		sortModel: GridSortModel
	): GridRowProps[] {
		return rows.sort((a, b): number => {
			let aval = a.row[sortModel.field];
			let bval = b.row[sortModel.field];

			const isAsc = sortModel.sort === "asc";

			if (!aval && bval) return isAsc ? 1 : -1;
			if (aval && !bval) return isAsc ? -1 : 1;
			if (!aval && !bval) return 0;

			aval = aval.toString().toLocaleLowerCase();
			bval = bval.toString().toLocaleLowerCase();

			if (aval < bval) {
				return isAsc ? -1 : 1;
			} else if (aval > bval) {
				return isAsc ? 1 : -1;
			} else {
				return 0;
			}
		});
	}

	$: sortedRows = sortRows(rows, sortModel);

	function createColumnMenu(column: GridColDef) {
		const menu = new Menu();

		if (column.editable) {
			menu.addItem((item) => {
				item.setTitle("Delete field")
					.setIcon("trash")
					.onClick(() => onColumnDelete(column.field));
			});

			menu.addSeparator();
		}

		menu.addItem((item) => {
			item.setTitle("Sort A → Z")
				.setIcon("up-and-down-arrows")
				.onClick(() => onSortModelChange(column.field, "asc"));
		});
		menu.addItem((item) => {
			item.setTitle("Sort Z → A")
				.setIcon("up-and-down-arrows")
				.onClick(() => onSortModelChange(column.field, "desc"));
		});

		return menu;
	}

	function createRowMenu(rowId: GridRowId, row: GridRowModel) {
		const menu = new Menu();

		menu.addItem((item) => {
			item.setTitle("Edit record")
				.setIcon("edit")
				.onClick(() => onRowEdit(rowId, row));
		});

		menu.addSeparator();

		menu.addItem((item) => {
			item.setTitle("Delete record")
				.setIcon("trash")
				.onClick(() => onRowDelete(rowId));
		});

		return menu;
	}

	function createCellMenu(
		rowId: GridRowId,
		row: GridRowModel,
		column: GridColDef,
		value: DataValue
	) {
		const menu = new Menu();

		if (column.editable) {
			menu.addItem((item) => {
				item.setTitle("Clear value")
					.setIcon("cross")
					.onClick(() => {
						onRowChange(
							rowId,
							produce(row, (draft) => {
								draft[column.field] = null;
								return draft;
							})
						);
					});
			});
		}

		return menu;
	}
</script>

<div>
	<GridHeader
		{columns}
		onResize={(name, width) => {
			onColumnResize(name, width);
		}}
		onColumnMenu={(field) => createColumnMenu(field)}
	/>
	{#each sortedRows as { rowId, row }, i}
		<GridRow
			{columns}
			index={i + 1}
			{rowId}
			{row}
			{onRowChange}
			onRowMenu={(rowId, row) => createRowMenu(rowId, row)}
			onCellMenu={(rowId, column, value) =>
				createCellMenu(rowId, row, column, value)}
			onNavigate={(event) =>
				onRowNavigate(rowId, row, event.ctrlKey || event.metaKey)}
		/>
	{/each}
</div>

<style>
	div {
		border-bottom: 1px solid var(--background-modifier-border);
		border-right: 1px solid var(--background-modifier-border);
		display: inline-block;
	}
</style>
