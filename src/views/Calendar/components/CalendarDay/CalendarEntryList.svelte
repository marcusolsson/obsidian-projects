<script lang="ts">
  import { InternalLink } from "obsidian-svelte";
  import { getDisplayName } from "src/views/Board/components/Board/board-helpers";
  import CalendarEntry from "./CalendarEntry.svelte";
  import { dndzone } from "svelte-dnd-action";
  import { app } from "src/lib/stores/obsidian";
  import type { DataRecord, DataValue, Optional } from "src/lib/data";

  export let records: DataRecord[];
  export let checkField: string | undefined;
  export let onEntryClick: (record: DataRecord) => void;
  export let onRecordUpdate: (record: DataRecord) => void;

  function asOptionalBoolean(value: Optional<DataValue>): Optional<boolean> {
    if (typeof value === "boolean") {
      return value;
    }
    return null;
  }

  const flipDurationMs = 200;

  function handleDndConsider(e: CustomEvent<DndEvent<DataRecord>>) {
    records = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<DataRecord>>) {
    records = e.detail.items;
    records.forEach((item) => onRecordUpdate(item));
  }
</script>

<div
  use:dndzone={{
    type: "entries",
    items: records,
    flipDurationMs,
    dropTargetStyle: {
      outline: "none",
      borderRadius: "5px",
      background: "hsla(var(--interactive-accent-hsl), 0.3)",
    },
  }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each records as record (record.id)}
    {#if getDisplayName(record)}
      <CalendarEntry
        checked={checkField !== undefined
          ? asOptionalBoolean(record.values[checkField])
          : undefined}
        on:check={({ detail: checked }) => {
          if (checkField) {
            onRecordUpdate({
              ...record,
              values: {
                ...record.values,
                [checkField]: checked,
              },
            });
          }
        }}
        on:click={() => {
          onEntryClick(record);
        }}
      >
        <InternalLink
          linkText={record.id}
          sourcePath=""
          resolved
          tooltip={getDisplayName(record)}
          on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
            if (newLeaf) {
              $app.workspace.openLinkText(linkText, sourcePath, newLeaf);
            } else {
              onEntryClick(record);
            }
          }}
        >
          {getDisplayName(record)}
        </InternalLink>
      </CalendarEntry>
    {/if}
  {/each}
</div>

<style>
  div {
    height: 100%;
    width: 100%;
  }
</style>
