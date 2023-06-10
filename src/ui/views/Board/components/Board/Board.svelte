<script lang="ts">
  import type { DataRecord, DataField } from "src/lib/dataframe/dataframe";
  import { dndzone } from "svelte-dnd-action";

  import BoardColumn from "./BoardColumn.svelte";

  type Column = {
    id: string;
    records: DataRecord[];
  };

  export let columns: Column[];

  export let groupByPriority: DataField | undefined;
  export let readonly: boolean;
  export let onRecordClick: (record: DataRecord) => void;
  export let onRecordUpdate: (column: string, record: DataRecord) => void;
  export let onRecordAdd: (column: string) => void;
  export let columnWidth: number;
  export let onSortColumns: (names: string[]) => void;
  export let dragDisabled: boolean;
  export let fields: DataField[];

  const flipDurationMs = 200;

  function handleDndConsider(e: CustomEvent<DndEvent<Column>>) {
    columns = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<Column>>) {
    columns = e.detail.items;
    onSortColumns(columns.map((col) => col.id));
  }
</script>

<div
  style={`grid-template-columns: repeat(${columns.length}, ${columnWidth}px);`}
  use:dndzone={{
    type: "columns",
    items: columns,
    flipDurationMs,
    dropTargetStyle: {
      outline: "none",
    },
  }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each columns as column (column.id)}
    <BoardColumn
      {readonly}
      name={column.id}
      records={column.records}
      {groupByPriority}
      {onRecordClick}
      onRecordAdd={() => onRecordAdd(column.id)}
      {dragDisabled}
      onRecordUpdate={(record) => onRecordUpdate(column.id, record)}
      {fields}
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
