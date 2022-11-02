<script lang="ts">
  import Sortable from "sortablejs";
  import { onDestroy, onMount } from "svelte";
  import type { DataRecord } from "../../../../lib/data";

  import BoardColumn from "./BoardColumn.svelte";

  export let columns: {
    id: string;
    name: string;
    records: DataRecord[];
  }[];

  export let groupByPriority: string | undefined;
  export let readonly: boolean;
  export let onRecordClick: (record: DataRecord) => void;
  export let onRecordAdd: (column: string) => void;
  export let columnWidth: number;
  export let onSortColumns: (names: string[]) => void;

  let ref: HTMLDivElement;
  let sortable: Sortable;

  onMount(() => {
    sortable = Sortable.create(ref, {
      animation: 150,
      direction: "horizontal",
      dataIdAttr: "data-id",
      store: {
        get() {
          return columns.map((column) => column.id);
        },
        set(sortable) {
          onSortColumns(sortable.toArray());
        },
      },
    });
  });

  onDestroy(() => {
    sortable.destroy();
  });
</script>

<div
  bind:this={ref}
  style={`grid-template-columns: repeat(${columns.length}, ${columnWidth}px);`}
>
  {#each columns as column (column.name)}
    <BoardColumn
      {readonly}
      name={column.name}
      records={column.records}
      {groupByPriority}
      {onRecordClick}
      onRecordAdd={() => onRecordAdd(column.name)}
    />
  {/each}
</div>

<style>
  div {
    display: grid;
    column-gap: 8px;
    align-items: flex-start;
  }
</style>
