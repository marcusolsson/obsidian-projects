<script lang="ts">
	import produce from "immer";

	import { Menu } from "obsidian";
	import GridHeader from "./GridHeader.svelte";

	import { i18n } from "../../../../lib/stores/i18n";

	import GridRow from "./GridRow.svelte";

	import {
		sortRows,
		sortColumns,
		type GridColDef,
		type GridRowId,
		type GridRowModel,
		type GridRowProps,
		type GridSortModel,
	} from "./data-grid";
	import GridCellGroup from "./GridCellGroup.svelte";
	import { Button, Icon } from "obsidian-svelte";

	export let columns: GridColDef[];
	export let rows: GridRowProps[];
	export let sortModel: GridSortModel;

	export let readonly: boolean;

	export let onSortModelChange: (field: string, sort: string) => void;
	export let onColumnResize: (field: string, width: number) => void;
	export let onRowAdd: () => void;
	export let onRowChange: (rowId: GridRowId, row: GridRowModel) => void;
	export let onRowNavigate: (rowId: GridRowId, openNew: boolean) => void;
	export let onColumnRename: (field: string) => void;
	export let onColumnDelete: (field: string) => void;
	export let onColumnHide: (column: GridColDef) => void;
	export let onRowDelete: (rowId: GridRowId) => void;
	export let onRowEdit: (rowId: GridRowId, row: GridRowModel) => void;

	$: t = $i18n.t;

	$: visibleColumns = columns.filter((column) => !column.hide);
	$: sortedColumns = sortColumns(visibleColumns);
	$: sortedRows = sortRows(rows, sortModel);

	// [column, row]
	let activeCell: [number, number] = [3, 3];

	function createColumnMenu(column: GridColDef) {
		const menu = new Menu();

		if (column.editable && !readonly) {
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
				.setIcon("sort-asc")
				.onClick(() => onSortModelChange(column.field, "asc"));
		});
		menu.addItem((item) => {
			item.setTitle(t("components.data-grid.sort.desc"))
				.setIcon("sort-desc")
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

		if (!readonly) {
			menu.addSeparator();

			menu.addItem((item) => {
				item.setTitle(t("components.data-grid.row.delete"))
					.setIcon("trash")
					.onClick(() => onRowDelete(rowId));
			});
		}

		return menu;
	}

	function createCellMenu(
		rowId: GridRowId,
		row: GridRowModel,
		column: GridColDef
	) {
		const menu = new Menu();

		if (column.editable) {
			menu.addItem((item) => {
				item.setTitle(t("components.data-grid.cell.clear"))
					.setIcon("x")
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

	const clamp = (num: number, min: number, max: number) =>
		Math.min(Math.max(num, min), max);
</script>

<div
	role="grid"
	aria-colcount={sortedColumns.length + 1}
	aria-rowcount={sortedRows.length + 2}
>
	<GridHeader
		columns={sortedColumns}
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
			columns={sortedColumns}
			index={i + 2}
			{rowId}
			{row}
			{activeCell}
			{onRowChange}
			onRowMenu={(rowId, row) => createRowMenu(rowId, row)}
			onCellMenu={(rowId, column) => createCellMenu(rowId, row, column)}
			onNavigate={(event) =>
				onRowNavigate(rowId, event.ctrlKey || event.metaKey)}
			on:navigate={({ detail: cell }) => {
				activeCell = [
					clamp(cell[0], 2, sortedColumns.length + 1),
					clamp(cell[1], 4, sortedRows.length + 3),
				];
			}}
		/>
	{/each}
	<GridCellGroup index={sortedRows.length + 2}>
		<span style={`width: ${60 + (sortedColumns[0]?.width ?? 0)}`}>
			{#if !readonly}
				<Button variant="plain" on:click={() => onRowAdd()}>
					<Icon name="plus" />
					{t("components.data-grid.row.add")}
				</Button>
			{/if}
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
