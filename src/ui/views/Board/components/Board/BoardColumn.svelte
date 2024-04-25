<script lang="ts">
  import { Button, Icon } from "obsidian-svelte";
  import type { DataField, DataRecord } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";
  import CardGroup from "./CardList.svelte";
  import ColumnHeader from "./ColumnHeader.svelte";
  import type { OnRecordClick, OnRecordCheck, OnRecordDrop } from "./types";
  import type { Menu } from "obsidian";

  export let width: number;

  export let name: string;
  export let records: DataRecord[];
  export let readonly: boolean;
  export let richText: boolean;
  export let checkField: string;
  export let includeFields: DataField[];
  export let collapse: boolean;

  export let onDrop: OnRecordDrop;
  export let onRecordClick: OnRecordClick;
  export let onRecordCheck: OnRecordCheck;
  export let onRecordAdd: () => void;
  export let onColumnMenu: () => Menu;
  export let onColumnRename: (name: string) => void;
  export let onValidate: (name: string) => boolean;
</script>

<section
  data-id={name}
  class="projects--board--column"
  class:collapse
  style={`width: ${width}px; margin-right: ${collapse ? 40 - width : 0}px`}
>
  <ColumnHeader
    value={name}
    count={records.length}
    {richText}
    {collapse}
    {onColumnMenu}
    {onColumnRename}
    {onValidate}
  />

  {#if !collapse}
    <CardGroup
      items={records}
      {onRecordClick}
      {checkField}
      {onRecordCheck}
      {onDrop}
      {includeFields}
    />
    {#if !readonly}
      <span>
        <Button variant="plain" on:click={() => onRecordAdd()}>
          <Icon name="plus" />
          {$i18n.t("views.board.note.add")}
        </Button>
      </span>
    {/if}
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

  .collapse {
    transform: rotate(-90deg) translateX(-100%);
    transform-origin: left top 0px;
  }
</style>
