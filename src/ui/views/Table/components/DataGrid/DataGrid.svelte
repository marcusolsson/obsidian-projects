<script lang="ts">
  import { produce } from "immer";

  import { Menu } from "obsidian";

  import { i18n } from "src/lib/stores/i18n";

  import GridRow from "./GridRow.svelte";

  import type {
    GridColDef,
    GridRowId,
    GridRowModel,
    GridRowProps,
  } from "./dataGrid";
  import GridCellGroup from "./GridCellGroup.svelte";
  import { Button, Icon } from "obsidian-svelte";
  import GridHeader from "./GridHeader/GridHeader.svelte";

  export let columns: GridColDef[];
  export let rows: GridRowProps[];
  export let colorModel: (rowId: string) => string | null;

  export let readonly: boolean;

  export let onColumnResize: (field: string, width: number) => void;
  export let onColumnSort: (fields: string[]) => void;
  export let onRowAdd: () => void;
  export let onRowChange: (rowId: GridRowId, row: GridRowModel) => void;
  export let onColumnConfigure: (column: GridColDef, editable: boolean) => void;
  export let onColumnDelete: (field: string) => void;
  export let onColumnHide: (column: GridColDef) => void;
  export let onColumnPin: (column: GridColDef) => void;
  export let onColumnInsert: (
    anchor: string, // anchor field name
    direction: number // 1 for right, 0 for left insert (keep the place and push back others)
  ) => void;
  export let onRowDelete: (rowId: GridRowId) => void;
  export let onRowEdit: (rowId: GridRowId, row: GridRowModel) => void;

  $: t = $i18n.t;

  $: visibleColumns = columns.filter((column) => !column.hide);
  $: sortedColumns = visibleColumns;

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

    if (!readonly) {
      menu.addItem((item) => {
        item
          .setTitle(t("components.data-grid.column.insert-left"))
          .setIcon("arrow-left")
          .onClick(() => {
            onColumnInsert(column.field, 0);
          });
      });

      menu.addItem((item) => {
        item
          .setTitle(t("components.data-grid.column.insert-right"))
          .setIcon("arrow-right")
          .onClick(() => {
            onColumnInsert(column.field, 1);
          });
      });
    }

    menu.addSeparator();

    menu.addItem((item) => {
      item
        .setTitle(
          column.pinned
            ? t("components.data-grid.column.unpin")
            : t("components.data-grid.column.pin")
        )
        .setIcon(column.pinned ? "pin-off" : "pin")
        .onClick(() => onColumnPin(column));
    });

    menu.addItem((item) => {
      item
        .setTitle(t("components.data-grid.column.hide"))
        .setIcon("eye-off")
        .onClick(() => {
          onColumnHide(column);
        });
    });

    if (editable) {
      menu.addItem((item) => {
        item
          .setTitle(t("components.data-grid.column.delete"))
          .setIcon("trash")
          .setWarning(true)
          .onClick(() => onColumnDelete(column.field));
      });
    }

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
          .setWarning(true)
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
  aria-rowcount={rows.length + 2}
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
  {#each rows as { rowId, row }, i (rowId)}
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
      on:navigate={({ detail: navinfo }) => {
        const colOffset = 1;
        const rowOffset = 3;

        const minColIdx = 1 + colOffset;
        const maxColIdx = sortedColumns.length + colOffset;

        const minRowIdx = 1 + rowOffset;
        const maxRowIdx = rows.length + rowOffset;

        const [colIdx, rowIdx, wrap] = navinfo;

        const wrapPrev =
          wrap && colIdx < minColIdx && !(rowIdx - 1 < minRowIdx);
        const wrapNext =
          wrap && colIdx > maxColIdx && !(rowIdx + 1 > maxRowIdx);

        if (wrapPrev) {
          activeCell = [maxColIdx, rowIdx - 1];
        } else if (wrapNext) {
          activeCell = [minColIdx, rowIdx + 1];
        } else {
          activeCell = [
            clamp(colIdx, minColIdx, maxColIdx),
            clamp(rowIdx, minRowIdx, maxRowIdx),
          ];
        }
      }}
    />
  {/each}
  <GridCellGroup index={rows.length + 2} footer>
    <span
      class="width-provider"
      style={`width: ${60 + (sortedColumns[0]?.width ?? 0)}`}
    >
      <span class="focus-provider">
        <Button variant="plain" on:click={() => onRowAdd()}>
          <Icon name="plus" />
          {t("components.data-grid.row.add")}
        </Button>
      </span>
    </span>
  </GridCellGroup>
</div>

<style>
  div {
    display: inline-block;
  }

  .width-provider {
    padding: 4px;
    position: sticky;
    left: 0;
  }

  .focus-provider {
    display: inline-flex;
    border-radius: var(--button-radius);
  }

  .focus-provider:focus-within {
    box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
  }
</style>
