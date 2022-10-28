<script lang="ts">
  import produce from "immer";
  import { TFile, type Menu } from "obsidian";

  import { GridCell, GridTypedCell, TextLabel } from "./GridCell";
  import type { DataValue } from "../../../../lib/data";
  import { IconButton } from "obsidian-svelte";
  import GridCellGroup from "./GridCellGroup.svelte";

  import type { GridColDef, GridRowId, GridRowModel } from "./data-grid";
  import { menuOnContextMenu } from "./data-grid";
  import { app } from "../../../../lib/stores/obsidian";

  import { setContext } from "svelte";

  export let rowId: GridRowId;
  export let index: number;
  export let row: GridRowModel;
  export let columns: GridColDef[];
  export let activeCell: [number, number];

  setContext<string>("sourcePath", row["path"]);

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
        menuOnContextMenu(event, onRowMenu(rowId, row));
      }
    };
  }

  function handleCellClick(
    column: GridColDef,
    value: DataValue
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

  function handleHoverLink(event: MouseEvent) {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    const targetEl = event.target;

    if (targetEl instanceof HTMLDivElement) {
      const file = $app.vault.getAbstractFileByPath(rowId);

      if (file instanceof TFile) {
        $app.workspace.trigger("hover-link", {
          event,
          source: "obsidian-projects-table-view",
          hoverParent: targetEl.parentElement,
          targetEl,
          linktext: file.name,
          sourcePath: file.path,
        });
      }
    }
  }
</script>

<GridCellGroup on:mouseover={handleHoverLink} {index}>
  <GridCell
    rowindex={1}
    colindex={1}
    column={{ field: "", header: true, width: 60, editable: false }}
    rowHeader
    on:mousedown={handleHeaderClick()}
  >
    <TextLabel slot="read" value={(index - 1).toString()} />
    <IconButton slot="hover" icon="link" size="sm" on:click={onNavigate} />
  </GridCell>

  {#each columns as column, i}
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
