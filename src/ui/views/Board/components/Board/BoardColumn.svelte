<script lang="ts">
  import { Button, Typography, Icon } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";

  import type { DataRecord, DataField } from "src/lib/dataframe/dataframe";
  import CardGroup from "./CardGroup.svelte";

  export let name: string;
  export let records: DataRecord[];
  export let readonly: boolean;
  export let onDrop: (records: DataRecord[]) => void;
  export let fields: DataField[];

  export let onRecordClick: (record: DataRecord) => void;
  export let onRecordAdd: () => void;
</script>

<div data-id={name} class="column">
  <div class="column-section">
    <Typography variant="label" nomargin>{name}</Typography>
  </div>
  <div class="column-section">
    <CardGroup items={records} {onRecordClick} {onDrop} {fields} />
  </div>
  {#if !readonly}
    <div class="column-section">
      <Button variant="plain" on:click={() => onRecordAdd()}>
        <Icon name="plus" />
        {$i18n.t("views.board.note.add")}
      </Button>
    </div>
  {/if}
</div>

<style>
  .column {
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
    background-color: var(--background-secondary);
    display: flex;
    flex-direction: column;
  }

  .column-section {
    padding: var(--size-4-2);
    display: flex;
    flex-direction: column;
  }
</style>
