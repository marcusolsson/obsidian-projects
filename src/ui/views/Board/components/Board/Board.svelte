<script lang="ts">
  import type { DataField } from "src/lib/dataframe/dataframe";
  import { dndzone } from "svelte-dnd-action";
  import { Menu } from "obsidian";

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
  import { i18n } from "src/lib/stores/i18n";

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
  export let checkField: string;
  export let includeFields: DataField[];

  const flipDurationMs = 200;

  function handleDndConsider(e: CustomEvent<DndEvent<Column>>) {
    columns = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<Column>>) {
    columns = e.detail.items;
    onSortColumns(columns.map((col) => col.id));
  }

  function createColumnMenu(column: Column) {
    const menu = new Menu();

    menu.addItem((item) => {
      item
        .setTitle(
          column.collapse
            ? $i18n.t("components.board.column.expand")
            : $i18n.t("components.board.column.collapse")
        )
        .setIcon(
          column.collapse ? "chevrons-left-right" : "chevrons-right-left"
        )
        .onClick(() => {
          onColumnCollapse(column.id, column.collapse);
        });
    });

    if (column.id !== $i18n.t("views.board.no-status")) {
      menu.addSeparator();

      menu.addItem((item) => {
        item
          .setTitle(
            column.pinned
              ? $i18n.t("components.board.column.unpin")
              : $i18n.t("components.board.column.pin")
          )
          .setIcon(column.pinned ? "pin-off" : "pin")
          .onClick(() => {
            onColumnPin(
              columns.map((col) => col.id),
              column.id,
              column.pinned
            );
          });
      });

      menu.addItem((item) => {
        item
          .setTitle($i18n.t("components.board.column.delete"))
          .setIcon("trash-2")
          .setWarning(true)
          .onClick(() => {
            onColumnDelete(
              columns.map((col) => col.id),
              column.id,
              column.records
            );
          });
      });
    }

    return menu;
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
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each columns as column (column.id)}
      <div class="projects--board--column--dndwrapper">
        <BoardColumn
          {readonly}
          {richText}
          width={columnWidth}
          collapse={column.collapse}
          name={column.id}
          records={column.records}
          {onRecordClick}
          {checkField}
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
          onColumnRename={(name) => {
            const cols = columns.map((col) => col.id);
            onColumnRename(cols, column.id, name, column.records);
          }}
          onValidate={(name) => {
            if (name === "") return false;
            if (columns.map((col) => col.id).includes(name)) return false;
            return true;
          }}
          onColumnMenu={() => createColumnMenu(column)}
        />
      </div>
    {/each}
  </section>
  {#if !readonly}
    <NewColumn
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
