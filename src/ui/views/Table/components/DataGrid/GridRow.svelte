<script lang="ts">
  import produce from "immer";
  import type { Menu } from "obsidian";

  import { GridCell, GridTypedCell } from "./GridCell";
  import type { DataValue, Optional } from "src/lib/dataframe/dataframe";
  import GridCellGroup from "./GridCellGroup.svelte";

  import type { GridColDef, GridRowId, GridRowModel } from "./dataGrid";
  import { handleHoverLink, menuOnContextMenu } from "src/ui/views/helpers";

  import { setContext } from "svelte";

  export let rowId: GridRowId;
  export let index: number;
  export let row: GridRowModel;
  export let columns: GridColDef[];
  export let activeCell: [number, number];
  export let color: string | null;

  setContext<string>("sourcePath", row["path"]);

  export let onRowChange: (rowId: GridRowId, row: GridRowModel) => void;
  export let onRowMenu: (rowId: GridRowId, row: GridRowModel) => Menu;
  export let onCellMenu: (
    rowId: GridRowId,
    column: GridColDef,
    value: Optional<DataValue>
  ) => Menu;

  function handleHeaderClick(): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
      if (event.button === 2) {
        menuOnContextMenu(event, onRowMenu(rowId, row));
      }
    };
  }

  function handleCellClick(
    column: GridColDef,
    value: Optional<DataValue>
  ): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
      if (event.button === 2) {
        menuOnContextMenu(event, onCellMenu(rowId, column, value));
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

<GridCellGroup on:mouseover={((event) => {handleHoverLink(event, rowId);})} {index}>
  <GridCell
    rowindex={1}
    colindex={1}
    column={{ field: "", header: true, width: 60, editable: false }}
    rowHeader
    on:mousedown={handleHeaderClick()}
    {color}
  >
    <div slot="read" style="text-align: center;">
      {(index - 1).toString()}
    </div>
  </GridCell>

  {#each columns as column, i (column.field)}
    <GridTypedCell
      selected={activeCell[0] === i + 2 && activeCell[1] === index + 2}
      rowindex={index + 2}
      colindex={i + 2}
      value={row[column.field]}
      {column}
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
      on:navigate
    />
  {/each}
</GridCellGroup>
