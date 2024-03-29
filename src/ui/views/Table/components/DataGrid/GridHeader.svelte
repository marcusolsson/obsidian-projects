<script lang="ts">
  import { get } from "svelte/store";
  import { Icon, IconButton } from "src/ui/mocks/obsidian-svelte";
  import type { Menu } from "obsidian";
  import { menuOnContextMenu } from "src/ui/views/helpers";

  import { GridCell, TextLabel } from "./GridCell";
  import { fieldIcon } from "src/ui/views/helpers";
  import type { GridColDef } from "./dataGrid";

  import GridCellGroup from "./GridCellGroup.svelte";

  import { DataFieldType } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";

  export let columns: GridColDef[];
  export let onResize: (name: string, width: number) => void;
  export let onFinalizeResize: (name: string, width: number) => void;
  export let onColumnMenu: (column: GridColDef) => Menu;

  function handleColumnHeaderClick(
    column: GridColDef
  ): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
      if (event.button === 2) {
        menuOnContextMenu(event, onColumnMenu(column));
      }
    };
  }

  function handleFieldClick(column: GridColDef): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
      onColumnMenu(column).showAtMouseEvent(event);
    };
  }
</script>

<GridCellGroup index={1} header>
  <GridCell
    colindex={1}
    rowindex={1}
    column={{ field: "", width: 60, header: true, editable: false }}
    columnHeader
    rowHeader
  />
  {#each columns as column, i (column.name)}
    <GridCell
      colindex={i + 2}
      rowindex={1}
      {column}
      resizable
      onResize={(width) => {
        onResize(column.field, width);
      }}
      onFinalizeResize={(width) => {
        onFinalizeResize(column.field, width);
      }}
      on:mousedown={handleColumnHeaderClick(column)}
      columnHeader
    >
      <svelte:fragment slot="read">
        {#if column.repeated}
          <Icon
            name="list"
            tooltip={get(i18n).t(`data-types.repeated`) ?? ""}
          />
        {:else}
          <Icon
            name={fieldIcon(column.type ?? DataFieldType.Unknown)}
            tooltip={get(i18n).t(`data-types.${column.type}`) ?? ""}
          />
        {/if}
        <TextLabel value={column.field} />
        <IconButton
          size="sm"
          icon="vertical-three-dots"
          onClick={handleFieldClick(column)}
        />
      </svelte:fragment>
    </GridCell>
  {/each}
</GridCellGroup>
