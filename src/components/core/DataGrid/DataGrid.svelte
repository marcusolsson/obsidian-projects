<script lang="ts">
	import produce from "immer";

	import { Menu } from "obsidian";
	import type { DataValue } from "src/lib/types";
	import GridHeader from "./GridHeader.svelte";

	import { i18n } from "src/lib/stores/i18n";

	import GridRow from "./GridRow.svelte";

	import {
		sortRows,
		type GridColDef,
		type GridRowId,
		type GridRowModel,
		type GridRowProps,
		type GridSortModel,
	} from "./data-grid";
	import GridCellGroup from "./GridCellGroup.svelte";
	import { Button } from "../Button";
	import Icon from "../Icon/Icon.svelte";

	export let columns: GridColDef[];
	export let rows: GridRowProps[];
	export let sortModel: GridSortModel;

	export let onSortModelChange: (field: string, sort: string) => void;
	export let onColumnResize: (field: string, width: number) => void;
	export let onRowAdd: () => void;
	export let onRowChange: (rowId: GridRowId, row: GridRowModel) => void;
	export let onRowNavigate: (
		rowId: GridRowId,
		row: GridRowModel,
		openNew: boolean
	) => void;
	export let onColumnRename: (field: string) => void;
	export let onColumnDelete: (field: string) => void;
	export let onColumnHide: (column: GridColDef) => void;
	export let onRowDelete: (rowId: GridRowId) => void;
	export let onRowEdit: (rowId: GridRowId, row: GridRowModel) => void;

	$: t = $i18n.t;

	$: visibleColumns = columns.filter((column) => !column.hide);
	$: sortedRows = sortRows(rows, sortModel);

	function createColumnMenu(column: GridColDef) {
		const menu = new Menu();

		if (column.editable) {
			menu.addItem((item) => {
				item.setTitle(t("components.data-grid.column.rename"))
					.setIcon("edit")
					.onClick(() => onColumnRename(column.field));
			});
			menu.addItem((item) => {
				item.setTitle(t("components.data-grid.column.delete"))
					.setIcon("trash")
					.onClick(() => onColumnDelete(column.field));
			});

			menu.addSeparator();
		}

		menu.addItem((item) => {
			item.setTitle(t("components.data-grid.sort.asc"))
				.setIcon("up-and-down-arrows")
				.onClick(() => onSortModelChange(column.field, "asc"));
		});
		menu.addItem((item) => {
			item.setTitle(t("components.data-grid.sort.desc"))
				.setIcon("up-and-down-arrows")
				.onClick(() => onSortModelChange(column.field, "desc"));
		});

		menu.addSeparator();

		menu.addItem((item) => {
			item.setTitle(t("components.data-grid.column.hide"))
				.setIcon("eye-off")
				.onClick(() => {
					onColumnHide(column);
				});
		});

		return menu;
	}

	function createRowMenu(rowId: GridRowId, row: GridRowModel) {
		const menu = new Menu();

		menu.addItem((item) => {
			item.setTitle(t("components.data-grid.row.edit"))
				.setIcon("edit")
				.onClick(() => onRowEdit(rowId, row));
		});

		menu.addSeparator();

		menu.addItem((item) => {
			item.setTitle(t("components.data-grid.row.delete"))
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
				item.setTitle(t("components.data-grid.cell.clear"))
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
		columns={visibleColumns}
		onResize={(name, width) => {
			columns = columns.map((column) =>
				column.field === name ? { ...column, width } : column
			);
		}}
		onFinalizeResize={(name, width) => {
			onColumnResize(name, width);
		}}
		onColumnMenu={(field) => createColumnMenu(field)}
	/>
	{#each sortedRows as { rowId, row }, i}
		<GridRow
			columns={visibleColumns}
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
	<GridCellGroup>
		<span style={`width: ${60 + (visibleColumns[0]?.width ?? 0)}`}>
			<Button variant="plain" on:click={() => onRowAdd()}>
				<Icon name="plus" />
				{t("components.data-grid.row.add")}
			</Button>
		</span>
	</GridCellGroup>
</div>

<style>
	div {
		display: inline-block;
	}

	span {
		padding: 4px;
		position: sticky;
		left: 0;
	}
</style>
