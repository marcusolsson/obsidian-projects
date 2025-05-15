<script lang="ts">
  import { Temporal } from "temporal-polyfill";
  import { Menu } from "obsidian";
  import type { DataRecord } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";
  import Date from "./Date.svelte";
  import EventList from "./EventList.svelte";
  import { menuOnContextMenu } from "src/ui/views/helpers";

  /**
   * Specifies the date of the day.
   */
  export let date: Temporal.PlainDate;

  /**
   * Specifies the width of the day div.
   */
  export let width: number;

  /**
   * Specifies the records representing the calendar events.
   */
  export let records: DataRecord[];

  /**
   * Specifies the field to use for determining checkbox state.
   */
  export let checkField: string | undefined;

  /**
   * onRecordClick runs when the user clicks a calendar event.
   */
  export let onRecordClick: (record: DataRecord) => void;

  /**
   * onRecordCheck runs when the user Checks / Unchecks a calendar event.
   */
  export let onRecordCheck: (record: DataRecord, checked: boolean) => void;

  /**
   * onRecordChange runs when the user changes the checked state.
   */
  export let onRecordChange: (record: DataRecord) => void;

  /**
   * onRecordAdd runs when the user creates a new calendar event on this day.
   */
  export let onRecordAdd: () => void;

  $: weekend = date.dayOfWeek % 7 === 0 || date.dayOfWeek === 6;
  $: today = date.equals(Temporal.Now.plainDateISO());

  function handleDblClick(event: MouseEvent) {
    onRecordAdd();
  }

  function handleMouseDown(event: MouseEvent) {
    if (event.button === 2) {
      const menu = new Menu().addItem((item) => {
        item
          .setTitle($i18n.t("views.calendar.new-note"))
          .setIcon("file-plus")
          .onClick(() => onRecordAdd());
      });
      menuOnContextMenu(event, menu);
    }
  }
</script>

<div
  class:weekend
  on:dblclick={handleDblClick}
  on:mousedown={handleMouseDown}
  style:width={width + "%"}
>
  <Date {today}>{date.day}</Date>
  <EventList
    {checkField}
    {records}
    {onRecordClick}
    {onRecordCheck}
    {onRecordChange}
  />
</div>

<style>
  div {
    border-right: 1px solid var(--background-modifier-border);
    padding: 4px;
    font-size: var(--font-ui-small);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  div:last-child {
    border-right: 0;
  }

  .weekend {
    background-color: var(--background-primary-alt);
  }
</style>
