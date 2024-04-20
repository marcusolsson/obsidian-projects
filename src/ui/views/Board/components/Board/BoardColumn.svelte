<script lang="ts">
  import { Button, Icon } from "obsidian-svelte";
  import type { DataField, DataRecord } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";
  import CardGroup from "./CardList.svelte";
  import ColumnHeader from "./ColumnHeader.svelte";
  import type { OnRecordClick, OnRecordDrop } from "./types";
  import type { Menu } from "obsidian";

  export let name: string;
  export let records: DataRecord[];
  export let readonly: boolean;
  export let richText: boolean;
  export let includeFields: DataField[];

  export let onDrop: OnRecordDrop;
  export let onRecordClick: OnRecordClick;
  export let onRecordAdd: () => void;
  export let onColumnMenu: () => Menu;
</script>

<section data-id={name} class="projects--board--column">
  <ColumnHeader value={name} {richText} {onColumnMenu} />
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
