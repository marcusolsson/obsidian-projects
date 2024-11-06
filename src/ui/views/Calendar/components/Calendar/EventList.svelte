<script lang="ts">
  // import { InternalLink } from "obsidian-svelte";
  import InternalLink from "src/ui/components/InternalLink.svelte";
  import { getDisplayName } from "src/ui/views/Board/components/Board/boardHelpers";
  import Event from "./Event.svelte";
  import { dndzone } from "svelte-dnd-action";
  import { app } from "src/lib/stores/obsidian";
  import type {
    DataRecord,
    DataValue,
    Optional,
  } from "src/lib/dataframe/dataframe";
  import { getRecordColorContext, handleHoverLink } from "src/ui/views/helpers";
  import { settings } from "src/lib/stores/settings";

  export let records: DataRecord[];
  export let checkField: string | undefined;

  export let onRecordClick: (record: DataRecord) => void;
  export let onRecordCheck: (record: DataRecord, checked: boolean) => void;
  export let onRecordChange: (record: DataRecord) => void;

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
    records.forEach(onRecordChange);
  }

  const getRecordColor = getRecordColorContext.get();
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
    {#if getDisplayName(record.id)}
      <Event
        color={getRecordColor(record)}
        checked={checkField !== undefined
          ? asOptionalBoolean(record.values[checkField])
          : undefined}
        on:check={({ detail: checked }) => onRecordCheck(record, checked)}
      >
        <InternalLink
          linkText={record.id}
          sourcePath={record.id}
          resolved
          tooltip={getDisplayName(record.id)}
          on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
            let openEditor =
              $settings.preferences.linkBehavior == "open-editor";

            if (newLeaf) {
              openEditor = !openEditor;
            }

            if (openEditor) {
              onRecordClick(record);
            } else {
              $app.workspace.openLinkText(linkText, sourcePath, true);
            }
          }}
          on:hover={({ detail: { event, sourcePath } }) => {
            handleHoverLink(event, sourcePath);
          }}
        >
          {getDisplayName(record.id)}
        </InternalLink>
      </Event>
    {/if}
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }
</style>
