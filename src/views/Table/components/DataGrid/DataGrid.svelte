<script lang="ts">
  import produce from "immer";

  import { Menu } from "obsidian";

  import { i18n } from "../../../../lib/stores/i18n";

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
  import { Button, Icon } from "obsidian-svelte";
  import { DataFieldType } from "src/lib/data";
  import GridHeader from "./GridHeader/GridHeader.svelte";

  export let columns: GridColDef[];
  export let rows: GridRowProps[];
  export let sortModel: GridSortModel;
  export let colorModel: (rowId: string) => string | null;

  export let readonly: boolean;

  export let onSortModelChange: (field: string, sort: string) => void;
  export let onColumnResize: (field: string, width: number) => void;
  export let onColumnSort: (fields: string[]) => void;
  export let onRowAdd: () => void;
  export let onRowChange: (rowId: GridRowId, row: GridRowModel) => void;
  export let onColumnConfigure: (column: GridColDef, editable: boolean) => void;
  export let onColumnDelete: (field: string) => void;
  export let onColumnHide: (column: GridColDef) => void;
  export let onRowDelete: (rowId: GridRowId) => void;
  export let onRowEdit: (rowId: GridRowId, row: GridRowModel) => void;

  $: t = $i18n.t;

  $: visibleColumns = columns.filter((column) => !column.hide);
  $: sortedColumns = visibleColumns;
  $: sortedRows = sortRows(rows, sortModel);

  // [column, row]
  let activeCell: [number, number] = [3, 3];

  function createColumnMenu(column: GridColDef) {
    const editable = !!column.editable && !readonly;

    const menu = new Menu();

    menu.addItem((item) => {
      item
        .setTitle(t("components.data-grid.column.configure"))
        .setIcon("settings")
        .onClick(() => onColumnConfigure(column, editable));
    });

    if (editable) {
      menu.addItem((item) => {
        item
          .setTitle(t("components.data-grid.column.delete"))
          .setIcon("trash")
          .onClick(() => onColumnDelete(column.field));
      });

      menu.addSeparator();
    }

    let isDateCol = column.type === DataFieldType.Date;

    menu.addItem((item) => {
      item
        .setTitle(
          t(
            isDateCol
              ? "components.data-grid.sortDate.asc"
              : "components.data-grid.sort.asc"
          )
        )
        .setIcon("sort-asc")
        .onClick(() => onSortModelChange(column.field, "asc"));
    });
    menu.addItem((item) => {
      item
        .setTitle(
          t(
            isDateCol
              ? "components.data-grid.sortDate.desc"
              : "components.data-grid.sort.desc"
          )
        )
        .setIcon("sort-desc")
        .onClick(() => onSortModelChange(column.field, "desc"));
    });

    menu.addSeparator();

    menu.addItem((item) => {
      item
        .setTitle(t("components.data-grid.column.hide"))
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
      item
        .setTitle(t("components.data-grid.row.edit"))
        .setIcon("edit")
        .onClick(() => onRowEdit(rowId, row));
    });

    if (!readonly) {
      menu.addSeparator();

      menu.addItem((item) => {
        item
          .setTitle(t("components.data-grid.row.delete"))
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
        item
          .setTitle(t("components.data-grid.cell.clear"))
          .setIcon("x")
          .onClick(() => {
            onRowChange(
              rowId,
              produce(row, (draft) => {
                draft[column.field] = undefined;
                return draft;
              })
            );
          });
      });
    }

    return menu;
  }

  function handleColumnOrder(columns: GridColDef[]) {
    onColumnSort(columns.map((col) => col.field));
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
    columns={sortedColumns
      .filter((col) => !col.hide)
      // svelte-dnd-action needs an `id` property.
      .map((col) => ({ ...col, id: col.field }))}
    onResize={(name, width) => {
      columns = columns.map((column) =>
        column.field === name ? { ...column, width } : column
      );
    }}
    onFinalizeResize={(name, width) => {
      onColumnResize(name, width);
    }}
    onColumnMenu={(field) => createColumnMenu(field)}
    onColumnOrder={handleColumnOrder}
  />
  {#each sortedRows as { rowId, row }, i (rowId)}
    <GridRow
      columns={sortedColumns}
      index={i + 2}
      {rowId}
      {row}
      {activeCell}
      {onRowChange}
      color={colorModel(rowId)}
      onRowMenu={(rowId, row) => createRowMenu(rowId, row)}
      onCellMenu={(rowId, column) => createCellMenu(rowId, row, column)}
      on:navigate={({ detail: cell }) => {
        const colOffset = 1;
        const rowOffset = 3;

        const minColIdx = 1 + colOffset;
        const maxColIdx = sortedColumns.length + colOffset;

        const minRowIdx = 1 + rowOffset;
        const maxRowIdx = sortedRows.length + rowOffset;

        const [colIdx, rowIdx] = cell;

        activeCell = [
          clamp(colIdx, minColIdx, maxColIdx),
          clamp(rowIdx, minRowIdx, maxRowIdx),
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
