<script lang="ts">
  import dayjs from "dayjs";
  import { Menu } from "obsidian";
  import type { DataRecord } from "src/lib/data";
  import { i18n } from "src/lib/stores/i18n";
  import Date from "./Date.svelte";
  import EventList from "./EventList.svelte";

  /**
   * Specifies the date of the day.
   */
  export let date: dayjs.Dayjs;

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
   * onRecordChange runs when the user changes the checked state.
   */
  export let onRecordChange: (record: DataRecord) => void;

  /**
   * onRecordAdd runs when the user creates a new calendar event on this day.
   */
  export let onRecordAdd: () => void;

  $: weekend = date.day() === 0 || date.day() === 6;
  $: today = date.startOf("day").isSame(dayjs().startOf("day"));

  function handleDblClick(event: MouseEvent) {
    onRecordAdd();
  }

  function handleMouseDown(event: MouseEvent) {
    if (event.button === 2) {
      new Menu()
        .addItem((item) => {
          item
            .setTitle($i18n.t("views.calendar.new-note"))
            .setIcon("file-plus")
            .onClick(() => onRecordAdd());
        })
        .showAtMouseEvent(event);
    }
  }
</script>

<div
  class="projects-calendar-day"
  class:projects-calendar-weekend={weekend}
  on:dblclick={handleDblClick}
  on:mousedown={handleMouseDown}
  style:width={width + "%"}
>
  <Date {today}>{date.date()}</Date>
  <EventList {checkField} {records} {onRecordClick} {onRecordChange} />
</div>

<style>
  .projects-calendar-day {
    border-right: 1px solid var(--background-modifier-border);
    padding: 4px;
    font-size: var(--font-ui-small);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .projects-calendar-day:last-child {
    border-right: 0;
  }

  .projects-calendar-weekend {
    background-color: var(--background-secondary);
  }
</style>
