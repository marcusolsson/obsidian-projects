<script lang="ts">
  import { Button, Icon } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";
  import ColumnHeader from "./ColumnHeader.svelte";

  import type { DataRecord, DataField } from "src/lib/dataframe/dataframe";
  import CardGroup from "./CardList.svelte";

  export let name: string;
  export let records: DataRecord[];
  export let readonly: boolean;
  export let richText: boolean;
  export let onDrop: (records: DataRecord[]) => void;
  export let includeFields: DataField[];

  export let onRecordClick: (record: DataRecord) => void;
  export let onRecordAdd: () => void;

  export let onColumnRename: (name: string) => void;
</script>

<section data-id={name} class="projects--board--column">
  <ColumnHeader
    value={name}
    {readonly}
    {richText}
    onRename={(name) => onColumnRename(name)}
    onValidate={() => true}
  />
  <CardGroup items={records} {onRecordClick} {onDrop} {includeFields} />
  {#if !readonly}
    <span>
      <Button variant="plain" on:click={() => onRecordAdd()}>
        <Icon name="plus" />
        {$i18n.t("views.board.note.add")}
      </Button>
    </span>
  {/if}
</section>

<style>
  span {
    display: inline-flex;
    align-content: center;
    justify-content: center;
    border-radius: var(--button-radius);
  }

  span:focus-within {
    box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
  }
</style>
