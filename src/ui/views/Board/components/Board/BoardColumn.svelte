<script lang="ts">
  import { Button, Icon } from "obsidian-svelte";
  import type { DataField, DataRecord } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";
  import CardGroup from "./CardList.svelte";
  import ColumnHeader from "./ColumnHeader.svelte";
  import type {
    OnRecordClick,
    OnRecordCheck,
    OnRecordDrop,
    OnColumnCollapse,
  } from "./types";
  import { Menu } from "obsidian";

  export let width: number;

  export let name: string;
  export let records: DataRecord[];
  export let readonly: boolean;
  export let richText: boolean;
  export let checkField: string | undefined;
  export let pointsField: string | undefined;
  export let includeFields: DataField[];
  export let customHeader: DataField | undefined;
  export let pinned: boolean;
  export let collapse: boolean;

  export let onDrop: OnRecordDrop;
  export let onRecordClick: OnRecordClick;
  export let onRecordCheck: OnRecordCheck;
  export let onRecordAdd: () => void;
  export let onColumnPin: (name: string) => void;
  export let onColumnCollapse: OnColumnCollapse;
  export let onColumnDelete: (name: string, records: DataRecord[]) => void;
  export let onColumnRename: (name: string) => void;
  export let onValidate: (name: string) => boolean;

  let editing: boolean = false;

  export let boardEditing: boolean = false;
  export let onEdit: (editing: boolean) => void;
  $: onEdit(editing);

  $: count = records.length;
  $: checkedCount = records.filter((r) => r.values[checkField ?? ""]).length;
  $: pointsCount = records.map((r) => r.values[pointsField ?? ""] as number)
                          .filter(Number.isFinite)
                          .reduce((sum, p) => sum + p, 0);

  function onColumnMenu() {
    const menu = new Menu();

    menu.addItem((item) => {
      item
        .setTitle($i18n.t("components.board.column.rename"))
        .setIcon("edit")
        .onClick(() => {
          editing = true;
        });
    });

    menu.addItem((item) => {
      item
        .setTitle(
          collapse
            ? $i18n.t("components.board.column.expand")
            : $i18n.t("components.board.column.collapse")
        )
        .setIcon(collapse ? "chevrons-left-right" : "chevrons-right-left")
        .onClick(() => {
          onColumnCollapse(name);
        });
    });

    menu.addItem((item) => {
      item
        .setTitle(
          pinned
            ? $i18n.t("components.board.column.unpin")
            : $i18n.t("components.board.column.pin")
        )
        .setIcon(pinned ? "pin-off" : "pin")
        .onClick(() => {
          onColumnPin(name);
        });
    });

    if (name !== $i18n.t("views.board.no-status")) {
      menu.addSeparator();

      menu.addItem((item) => {
        item
          .setTitle($i18n.t("components.board.column.delete"))
          .setIcon("trash-2")
          .setWarning(true)
          .onClick(() => {
            onColumnDelete(name, records);
          });
      });
    }

    return menu;
  }
</script>

<section
  data-id={name}
  class="projects--board--column"
  class:collapse
  style={`width: ${width}px; margin-right: ${collapse ? 40 - width : 0}px`}
>
  <ColumnHeader
    value={name}
    {count}
    {checkedCount}
    {pointsCount}
    bind:editing
    {richText}
    {collapse}
    {checkField}
    {pointsField}
    {onColumnMenu}
    {onColumnRename}
    {onValidate}
  />

  {#if !collapse}
    <CardGroup
      items={records}
      {boardEditing}
      {customHeader}
      {onRecordClick}
      {checkField}
      {pointsField}
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
