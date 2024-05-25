<script lang="ts">
  import type { Menu } from "obsidian";
  import { GridCell } from "../GridCell";
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import type { GridColDef } from "../dataGrid";
  import Resizer from "../GridCell/Resizer.svelte";
  import GridColumnHeader from "./GridColumnHeader.svelte";

  type GridColDefWithId = GridColDef & { readonly id: string };

  export let columns: GridColDefWithId[];
  export let onResize: (name: string, width: number) => void;
  export let onFinalizeResize: (name: string, width: number) => void;
  export let onColumnMenu: (column: GridColDef) => Menu;
  export let onColumnOrder: (columns: GridColDefWithId[]) => void;

  const flipDurationMs = 200;

  function handleDndConsider(e: CustomEvent<DndEvent<GridColDefWithId>>) {
    columns = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<GridColDefWithId>>) {
    columns = e.detail.items;
    onColumnOrder(columns);
  }
</script>

<div class="flex container">
  <GridCell
    colindex={1}
    rowindex={1}
    column={{ field: "", width: 60, header: true, editable: false }}
    columnHeader
    rowHeader
  />
  <div
    class="flex"
    use:dndzone={{
      items: columns,
      flipDurationMs,
      dropTargetStyle: {
        outline: "none",
        background: "hsla(var(--interactive-accent-hsl), 0.3)",
      },
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each columns as column, columnIdx (column.id)}
      <div
        class={`flex relative`}
        animate:flip={{ duration: flipDurationMs }}
        class:pinned={column.pinned}
      >
        <GridColumnHeader {column} {onColumnMenu} colindex={columnIdx} />
        <Resizer
          width={column.width ?? 180}
          min={100}
          onChange={(width) => {
            onResize(column.field, width);
          }}
          onFinalize={(width) => {
            onFinalizeResize(column.field, width);
          }}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  div.container {
    position: sticky;
    top: 0;
    z-index: 6;
  }

  div.flex {
    display: flex;
  }

  div.relative {
    position: relative;
  }

  div.pinned {
    left: 60px;
    z-index: 6;
    position: sticky;
  }
</style>
