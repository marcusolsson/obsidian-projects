<script lang="ts">
  import type { DataField } from "src/lib/dataframe/dataframe";
  import { dndzone } from "svelte-dnd-action";

  import BoardColumn from "./BoardColumn.svelte";
  import NewColumn from "./NewColumn.svelte";
  import type {
    Column,
    OnRecordAdd,
    OnRecordClick,
    OnRecordCheck,
    OnRecordUpdate,
    OnSortColumns,
    OnColumnAdd,
    OnColumnDelete,
    OnColumnRename,
    OnColumnCollapse,
    OnColumnPin,
  } from "./types";

  export let columns: Column[];

  export let readonly: boolean;
  export let richText: boolean;
  export let onRecordClick: OnRecordClick;
  export let onRecordCheck: OnRecordCheck;
  export let onRecordUpdate: OnRecordUpdate;
  export let onRecordAdd: OnRecordAdd;
  export let columnWidth: number;
  export let onSortColumns: OnSortColumns;
  export let onColumnAdd: OnColumnAdd;
  export let onColumnDelete: OnColumnDelete;
  export let onColumnRename: OnColumnRename;
  export let onColumnCollapse: OnColumnCollapse;
  export let onColumnPin: OnColumnPin;
  export let checkField: string | undefined;
  export let weightField: string | undefined;
  export let includeFields: DataField[];
  export let customHeader: DataField | undefined;

  let boardEditing: boolean = false;
  let onEdit = (editing: boolean) => (boardEditing = editing);

  const flipDurationMs = 200;

  function handleDndConsider(e: CustomEvent<DndEvent<Column>>) {
    columns = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<Column>>) {
    columns = e.detail.items;
    onSortColumns(columns.map((col) => col.id));
  }
</script>

<div>
  <section
    class="projects--board"
    use:dndzone={{
      type: "columns",
      items: columns,
      flipDurationMs,
      dropTargetStyle: {
        outline: "none",
      },
      dragDisabled: boardEditing,
      morphDisabled: true,
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each columns as column (column.id)}
      <div class="projects--board--column--dndwrapper">
        <BoardColumn
          {readonly}
          {richText}
          {boardEditing}
          {onEdit}
          width={columnWidth}
          collapse={column.collapse}
          pinned={column.pinned}
          name={column.id}
          records={column.records}
          {onRecordClick}
          {checkField}
          {weightField}
          {onRecordCheck}
          onRecordAdd={() => onRecordAdd(column.id)}
          onDrop={(record, records, trigger) => {
            switch (trigger) {
              case "droppedIntoZone":
                onRecordUpdate(record, { ...column, records }, "addToColumn");
                break;
              case "droppedIntoAnother":
                onRecordUpdate(
                  record,
                  { ...column, records },
                  "removeFromColumn"
                );
                break;
            }
          }}
          {includeFields}
          {customHeader}
          onColumnPin={(name) =>
            onColumnPin(
              columns.map((col) => col.id),
              name
            )}
          onColumnDelete={(name, records) =>
            onColumnDelete(
              columns.map((col) => col.id),
              name,
              records
            )}
          {onColumnCollapse}
          onColumnRename={(name) => {
            const cols = columns.map((col) => col.id);
            onColumnRename(cols, column.id, name, column.records);
          }}
          onValidate={(name) => {
            if (name === "") return false;
            if (columns.map((col) => col.id).includes(name)) return false;
            return true;
          }}
        />
      </div>
    {/each}
  </section>
  {#if !readonly}
    <NewColumn
      {onEdit}
      onColumnAdd={(name) => {
        const cols = columns.map((col) => col.id);
        onColumnAdd(cols, name);
      }}
      onValidate={(name) => {
        if (name === "") return false;
        if (columns.map((col) => col.id).includes(name)) return false;

        return true;
      }}
    />
  {/if}
</div>

<style>
  div {
    display: flex;
  }
</style>
