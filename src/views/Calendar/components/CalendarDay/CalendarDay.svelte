<script lang="ts">
  import type dayjs from "dayjs";
  import { Menu } from "obsidian";

  import { i18n } from "src/lib/stores/i18n";

  import type { DataRecord } from "src/lib/data";

  import { TableCell } from "../Table";
  import CalendarDate from "./CalendarDate.svelte";
  import CalendarEntryList from "./CalendarEntryList.svelte";

  export let date: dayjs.Dayjs;
  export let records: DataRecord[];
  export let checkField: string | undefined;
  export let onEntryAdd: () => void;
  export let onEntryClick: (record: DataRecord) => void;
  export let onRecordUpdate: (date: dayjs.Dayjs, record: DataRecord) => void;
</script>

<TableCell
  width="calc(100% / 7)"
  on:dblclick={() => onEntryAdd()}
  on:mousedown={(event) => {
    if (event.button === 2) {
      const menu = new Menu();

      menu.addItem((item) => {
        item
          .setTitle($i18n.t("views.calendar.new-note"))
          .setIcon("file")
          .onClick(onEntryAdd);
      });

      menu.showAtMouseEvent(event);
    }
  }}
>
  <div class:weekend={date.day() === 0 || date.day() === 6}>
    <CalendarDate {date} />
    <CalendarEntryList
      {records}
      {onEntryClick}
      onRecordUpdate={(record) => {
        onRecordUpdate(date, record);
      }}
      {checkField}
    />
  </div>
</TableCell>

<style>
  div {
    padding: 4px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: start;
    overflow: scroll;
    min-height: 6rem;
  }

  .weekend {
    background-color: var(--background-secondary);
  }
</style>
