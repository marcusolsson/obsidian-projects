<script lang="ts">
  // import { DateInput } from "obsidian-svelte";
  import { isDate } from "src/lib/dataframe/dataframe";
  import DateInput from "src/ui/components/DateInput.svelte";
  import type { Optional } from "src/lib/dataframe/dataframe";
  import { Temporal } from "temporal-polyfill";

  import { GridCell } from "..";
  import { TextLabel } from "..";
  import type { GridColDef } from "../../dataGrid";

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
        value.toPlainDate().toString()
        // new Intl.DateTimeFormat("default", {
        //   year: "numeric",
        //   month: "numeric",
        //   day: "numeric",
        // }).format(value)
      );
    }
  }}
>
  <svelte:fragment slot="read">
    {#if value}
      <TextLabel
        value={value.toPlainDate().toLocaleString("default", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}
      />
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="edit">
    <DateInput
      value={value?.toPlainDate() ?? null}
      on:change={({ detail: value }) => {
        if (value) {
          cachedValue = cachedValue
            ? cachedValue.with({
                year: value.year,
                month: value.month,
                day: value.day,
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
          })
        );
      }}
      embed
    />
  </svelte:fragment>
</GridCell>
