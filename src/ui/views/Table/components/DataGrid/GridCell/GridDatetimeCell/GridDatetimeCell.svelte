<script lang="ts">
  import DatetimeInput from "src/ui/components/DatetimeInput.svelte";
  // import { DatetimeInput } from "obsidian-svelte";
  import type { Optional } from "src/lib/dataframe/dataframe";

  import { GridCell } from "..";
  import { TextLabel } from "..";
  import type { GridColDef } from "../../dataGrid";

  export let value: Optional<Date>;
  let cachedValue: Optional<Date> = value; // store the proposing value
  export let onChange: (value: Optional<Date>) => void;
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
        new Intl.DateTimeFormat("default", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }).format(value)
      );
    }
  }}
>
  <svelte:fragment slot="read">
    {#if value}
      <TextLabel
        value={new Intl.DateTimeFormat("default", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }).format(value)}
      />
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="edit">
    <DatetimeInput
      value={value != undefined ? value : null}
      on:input={({ detail: value }) => (cachedValue = value)}
      on:blur={() => {
        edit = false;
        onChange(cachedValue);
      }}
      embed
    />
  </svelte:fragment>
</GridCell>
