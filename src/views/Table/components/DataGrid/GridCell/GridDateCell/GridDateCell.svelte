<script lang="ts">
  import dayjs from "dayjs";
  import { DateInput } from "obsidian-svelte";

  import { GridCell } from "..";
  import { TextLabel } from "..";
  import type { GridColDef } from "../../data-grid";

  export let value: Date | undefined;
  export let onChange: (value: Date | undefined) => void;
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
      navigator.clipboard.writeText(dayjs(value).format("L"));
    }
  }}
>
  <svelte:fragment slot="read">
    {#if value}
      <TextLabel value={dayjs(value).format("L")} />
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
