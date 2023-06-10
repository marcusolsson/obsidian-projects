<script lang="ts">
  import { Button, Typography, Icon } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";

  import { type DataRecord, type DataField, DataFieldType } from "src/lib/data";
  import {
    getPrioritizedRecords,
    getUnprioritizedRecords,
  } from "src/ui/views/Board/components/Board/board-helpers";
  import CardGroup from "./CardGroup.svelte";

  export let name: string;
  export let records: DataRecord[];
  export let groupByPriority: DataField | undefined;
  export let readonly: boolean;
  export let dragDisabled: boolean = false;
  export let onRecordUpdate: (record: DataRecord) => void;
  export let fields: DataField[];

  $: prioritized = getPrioritizedRecords(records, groupByPriority);
  $: unprioritized = getUnprioritizedRecords(records, groupByPriority);

  export let onRecordClick: (record: DataRecord) => void;
  export let onRecordAdd: () => void;

  function handleDropPrioritized(items: DataRecord[]) {
    items.forEach((item, i) => {
      if (groupByPriority) {
        if (groupByPriority.type === DataFieldType.Number) {
          onRecordUpdate({
            ...item,
            values: {
              ...item.values,
              [groupByPriority.name]: i + 1,
            },
          });
        } else if (groupByPriority.type === DataFieldType.Date) {
          onRecordUpdate(item);
        }
      }
    });
  }

  function handleDropUnprioritized(items: DataRecord[]) {
    items.forEach((item) => {
      if (groupByPriority) {
        onRecordUpdate({
          ...item,
          values: {
            ...item.values,
            [groupByPriority.name]: undefined,
          },
        });
      }
    });
  }
</script>

<div data-id={name} class="column">
  <div class="column-section">
    <Typography variant="label" nomargin>{name}</Typography>
  </div>
  {#if groupByPriority}
    <div class="column-section">
      <CardGroup
        items={prioritized}
        {onRecordClick}
        onDrop={handleDropPrioritized}
        {dragDisabled}
        {fields}
      />
    </div>
    <div class="column-section unprio">
      <p>{$i18n.t("views.board.unprioritized")}</p>
      <CardGroup
        items={unprioritized}
        {onRecordClick}
        onDrop={handleDropUnprioritized}
        {dragDisabled}
        {fields}
      />
    </div>
  {:else}
    <div class="column-section">
      <CardGroup items={records} {onRecordClick} dragDisabled={true} {fields} />
    </div>
  {/if}
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

  .unprio {
    border-top: 1px solid var(--background-modifier-border);
  }

  p {
    font-weight: 500;
    margin: 0;
    margin-bottom: 4px;
    color: var(--text-faint);
    font-size: var(--font-smaller);
  }
</style>
