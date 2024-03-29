<script lang="ts">
  import type { DataField } from "src/lib/dataframe/dataframe";
  import { dndzone } from "svelte-dnd-action";

  import BoardColumn from "./BoardColumn.svelte";
  import type {
    Column,
    OnRecordAdd,
    OnRecordClick,
    OnRecordUpdate,
    OnSortColumns,
  } from "./types";

  export let columns: Column[];

  export let readonly: boolean;
  export let richText: boolean;
  export let onRecordClick: OnRecordClick;
  export let onRecordUpdate: OnRecordUpdate;
  export let onRecordAdd: OnRecordAdd;
  export let columnWidth: number;
  export let onSortColumns: OnSortColumns;
  export let includeFields: DataField[];

  const flipDurationMs = 200;

  function handleDndConsider(e: CustomEvent<DndEvent<Column>>) {
    columns = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<Column>>) {
    columns = e.detail.items;
    onSortColumns(columns.map((col) => col.id));
  }
</script>

<section
  class="projects--board"
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
      {richText}
      name={column.id}
      records={column.records}
      {onRecordClick}
      onRecordAdd={() => onRecordAdd(column.id)}
      onDrop={(record, records, trigger) => {
        switch (trigger) {
          case "droppedIntoZone":
            onRecordUpdate(record, { ...column, records }, "addToColumn");
            break;
          case "droppedIntoAnother":
            onRecordUpdate(record, { ...column, records }, "removeFromColumn");
            break;
        }
      }}
      {includeFields}
    />
  {/each}
</section>
