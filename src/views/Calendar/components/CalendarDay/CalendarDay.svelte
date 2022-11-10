<script lang="ts">
  import path from "path";
  import type dayjs from "dayjs";
  import { Menu } from "obsidian";
  import { InternalLink } from "obsidian-svelte";

  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";

  import type { DataRecord, DataValue } from "src/lib/data";

  import { TableCell } from "../Table";
  import CalendarDate from "./CalendarDate.svelte";
  import CalendarEntry from "./CalendarEntry.svelte";
  import CalendarEntryList from "./CalendarEntryList.svelte";
  import type { Dayjs } from "dayjs";

  export let date: dayjs.Dayjs;
  export let records: DataRecord[];

  export let checkField: string | undefined;

  export let onEntryClick: (recordId: string) => void;
  export let onEntryAdd: () => void;
  export let onRecordUpdate: (record: DataRecord) => void;
  export let onReschedule: (recordId: string, date: Dayjs) => void;

  function getDisplayName(record: DataRecord): string {
    const basename = path.basename(record.id);
    return basename.slice(0, basename.lastIndexOf("."));
  }

  function asOptionalBoolean(value: DataValue): boolean | null {
    if (typeof value === "boolean") {
      return value;
    }
    return null;
  }
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
      date={date.format("YYYY-MM-DD")}
      onMoveRecord={(date, id) => {
        if (date && id) {
          onReschedule(id, date);
        }
      }}
    >
      {#each records as record}
        {#if getDisplayName(record)}
          <CalendarEntry
            id={record.id}
            checked={checkField !== undefined
              ? asOptionalBoolean(record.values[checkField])
              : undefined}
            on:check={({ detail: checked }) => {
              if (checkField) {
                onRecordUpdate({
                  ...record,
                  values: {
                    ...record.values,
                    [checkField]: checked,
                  },
                });
              }
            }}
            on:click={() => {
              onEntryClick(record.id);
            }}
          >
            <InternalLink
              linkText={record.id}
              sourcePath=""
              resolved
              tooltip={getDisplayName(record)}
              on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
                if (newLeaf) {
                  $app.workspace.openLinkText(linkText, sourcePath, newLeaf);
                } else {
                  onEntryClick(record.id);
                }
              }}
            >
              {getDisplayName(record)}
            </InternalLink>
          </CalendarEntry>
        {/if}
      {/each}
    </CalendarEntryList>
  </div>
</TableCell>

<style>
  div {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 4px;
    overflow: scroll;
    gap: 4px;
    align-items: flex-start;
  }

  .weekend {
    background-color: var(--background-secondary);
  }
</style>
