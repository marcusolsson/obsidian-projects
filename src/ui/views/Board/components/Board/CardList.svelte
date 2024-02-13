<script lang="ts">
  import { InternalLink } from "obsidian-svelte";
  import type { DataField, DataRecord } from "src/lib/dataframe/dataframe";
  import { dndzone } from "svelte-dnd-action";
  import { getDisplayName } from "./boardHelpers";
  import { app } from "src/lib/stores/obsidian";
  import { flip } from "svelte/animate";
  import { getRecordColorContext } from "src/ui/views/helpers";
  import CardMetadata from "src/ui/components/CardMetadata/CardMetadata.svelte";
  import ColorItem from "src/ui/components/ColorItem/ColorItem.svelte";
  import { settings } from "src/lib/stores/settings";

  export let items: DataRecord[];
  export let onRecordClick: (record: DataRecord) => void;
  export let onDrop: (records: DataRecord[]) => void = () => {};
  export let includeFields: DataField[];

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

  const getRecordColor = getRecordColorContext.get();
</script>

<div
  class="projects--board--card-list"
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
  use:dndzone={{
    type: "card",
    items,
    flipDurationMs,
    dropTargetStyle: {
      outline: "none",
      borderRadius: "5px",
      background: "hsla(var(--interactive-accent-hsl), 0.3)",
      transition: "all 150ms easy-in-out",
    },
  }}
>
  {#each items as item (item.id)}
    {@const color = getRecordColor(item)}

    <article
      class="projects--board--card"
      on:keypress
      on:click={() => onRecordClick(item)}
      animate:flip={{ duration: flipDurationMs }}
    >
      <ColorItem {color}>
        <InternalLink
          slot="header"
          linkText={item.id}
          sourcePath=""
          resolved
          on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
            let openEditor =
              $settings.preferences.linkBehavior == "open-editor";

            if (newLeaf) {
              openEditor = !openEditor;
            }

            if (openEditor) {
              onRecordClick(item);
            } else {
              $app.workspace.openLinkText(linkText, sourcePath, true);
            }
          }}
        >
          {getDisplayName(item.id)}
        </InternalLink>
        <CardMetadata fields={includeFields} record={item} />
      </ColorItem>
    </article>
  {/each}
</div>
