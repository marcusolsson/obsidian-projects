<script lang="ts">
  import { DateInput } from "obsidian-svelte";
  import type { Optional } from "src/lib/data";

  import { GridCell } from "..";
  import { TextLabel } from "..";
  import type { GridColDef } from "../../data-grid";

  export let value: Optional<Date>;
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
      navigator.clipboard.writeText(new Intl.DateTimeFormat().format(value));
    }
  }}
>
  <svelte:fragment slot="read">
    {#if value}
      <TextLabel value={new Intl.DateTimeFormat().format(value)} />
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="edit">
    <DateInput
      value={value != undefined ? value : null}
      on:change={({ detail: value }) => {
        edit = false;
        onChange(value != null ? value : undefined);
      }}
      embed
    />
  </svelte:fragment>
</GridCell>
