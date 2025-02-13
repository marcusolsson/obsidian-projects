<script lang="ts">
  import DatetimeInput from "src/ui/components/DatetimeInput.svelte";
  // import { DatetimeInput } from "obsidian-svelte";
  import { isDate } from "src/lib/dataframe/dataframe";
  import type { Optional } from "src/lib/dataframe/dataframe";

  import { GridCell } from "..";
  import { TextLabel } from "..";
  import type { GridColDef } from "../../dataGrid";
  import { Temporal } from "temporal-polyfill";

  export let value: Optional<Temporal.ZonedDateTime>;
  let cachedValue: Optional<Temporal.ZonedDateTime> = value; // store the proposing value
  export let onChange: (value: Optional<Temporal.ZonedDateTime>) => void;
  export let column: GridColDef;
  export let rowindex: number;
  export let colindex: number;
  export let selected: boolean;

  let edit = false;
</script>

<GridCell
  {selected}
  {rowindex}
  {colindex}
  {edit}
  onEditChange={(mode) => {
    edit = mode;
  }}
  {column}
  on:mousedown
  on:navigate
  onCopy={() => {
    if (value) {
      navigator.clipboard.writeText(
        value.toPlainDateTime().toString({ smallestUnit: "minute" })
        // TODO: human friendly or machine friendly?
        // handle on paste
      );
    }
  }}
>
  <svelte:fragment slot="read">
    {#if value}
      <TextLabel
        value={value.toPlainDateTime().toLocaleString("default", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })}
      />
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="edit">
    <DatetimeInput
      value={value?.toPlainDateTime() ?? null}
      on:change={({ detail: value }) => {
        if (value) {
          cachedValue = cachedValue
            ? cachedValue.with({
                year: value.year,
                month: value.month,
                day: value.day,
                hour: value.hour,
                minute: value.minute,
                second: value.second,
              })
            : value.toZonedDateTime(Temporal.Now.timeZoneId());
        } else {
          cachedValue = null;
        }
      }}
      on:input={({ detail: value }) => {
        if (value) {
          cachedValue = cachedValue
            ? cachedValue.with({
                year: value.year,
                month: value.month,
                day: value.day,
                hour: value.hour,
                minute: value.minute,
                second: value.second,
              })
            : value.toZonedDateTime(Temporal.Now.timeZoneId());
        } else {
          cachedValue = null;
        }
      }}
      on:blur={() => {
        edit = false;
        if (!cachedValue || !isDate(value)) {
          onChange(cachedValue);
          return;
        }
        onChange(
          value.with({
            year: cachedValue.year,
            month: cachedValue.month,
            day: cachedValue.day,
            hour: cachedValue.hour,
            minute: cachedValue.minute,
            second: cachedValue.second,
          })
        );
      }}
      embed
    />
  </svelte:fragment>
</GridCell>
