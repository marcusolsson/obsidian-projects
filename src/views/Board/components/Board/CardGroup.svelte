<script lang="ts">
  import { InternalLink } from "obsidian-svelte";
  import type { DataRecord } from "src/lib/data";
  import { dndzone } from "svelte-dnd-action";
  import { getDisplayName } from "./board-helpers";
  import { app } from "src/lib/stores/obsidian";
  import { flip } from "svelte/animate";
  import { getRecordColorContext } from "src/views/helpers";

  export let items: DataRecord[];
  export let onRecordClick: (record: DataRecord) => void;
  export let onDrop: (records: DataRecord[]) => void = () => {};
  export let dragDisabled: boolean = false;

  const flipDurationMs = 200;

  function handleDndConsider(e: CustomEvent<DndEvent<DataRecord>>) {
    items = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<DataRecord>>) {
    items = e.detail.items;
    if (onDrop) {
      onDrop(e.detail.items);
    }
  }

  const getRecordColor = getRecordColorContext();
</script>

<div
  class="lst"
  use:dndzone={{
    type: "card",
    items,
    flipDurationMs,
    dropTargetStyle: {
      outline: "none",
      borderRadius: "5px",
      background: "hsla(var(--interactive-accent-hsl), 0.3)",
    },
    dragDisabled: dragDisabled,
  }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each items as item (item.id)}
    {@const color = getRecordColor(item)}
    <div
      class="crd"
      on:keypress
      on:click={() => onRecordClick(item)}
      animate:flip={{ duration: flipDurationMs }}
    >
      {#if color}
        <span
          style="margin-right: 8px; background-color: {color}; width: 5px; border-radius: 9999px;"
        />
      {/if}
      <InternalLink
        linkText={item.id}
        sourcePath=""
        resolved
        on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
          if (newLeaf) {
            $app.workspace.openLinkText(linkText, sourcePath, newLeaf);
          } else {
            onRecordClick(item);
          }
        }}
      >
        {getDisplayName(item.id)}
      </InternalLink>
    </div>
  {/each}
</div>

<style>
  .lst {
    display: flex;
    flex-direction: column;
    gap: var(--size-4-2);
    min-height: 35px;
  }

  .crd {
    background-color: var(--background-primary);
    border-radius: var(--radius-s);
    border: 1px solid var(--background-modifier-border);
    padding: var(--size-4-2);
    display: flex;
  }

  .crd:hover {
    border: 1px solid var(--background-modifier-border-hover);
  }
</style>
