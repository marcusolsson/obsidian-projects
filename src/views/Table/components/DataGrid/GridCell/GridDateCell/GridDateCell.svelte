<script lang="ts">
  import type { Dayjs } from "dayjs";
  import { DateInput } from "obsidian-svelte";

  import { GridCell } from "..";
  import { TextLabel } from "..";
  import type { GridColDef } from "../../data-grid";

  export let value: Dayjs | undefined;
  export let onChange: (value: Dayjs | undefined) => void;
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
      navigator.clipboard.writeText(value.format("L"));
    }
  }}
>
  <svelte:fragment slot="read">
    {#if value}
      <TextLabel value={value.format("L")} />
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="edit">
    <DateInput
      value={value ?? null}
      on:change={({ detail: value }) => {
        edit = false;
        onChange(value != null ? value : undefined);
      }}
      embed
    />
  </svelte:fragment>
</GridCell>
