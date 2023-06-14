<script lang="ts">
  import { isBoolean, type Optional } from "src/lib/dataframe/dataframe";
  import { Switch } from "obsidian-svelte";
  import { GridCell } from "..";
  import type { GridColDef } from "../../dataGrid";

  export let value: Optional<boolean>;
  export let onChange: (value: boolean) => void;
  export let column: GridColDef;
  export let rowindex: number;
  export let colindex: number;
  export let selected: boolean;
</script>

<GridCell {selected} {rowindex} {colindex} {column} on:mousedown on:navigate>
  <svelte:fragment slot="read">
    {#if isBoolean(value)}
      <Switch
        checked={value}
        on:check={({ detail: checked }) => onChange(checked)}
        disabled={!column.editable}
      />
    {/if}
  </svelte:fragment>
  <Switch
    slot="edit"
    checked={value ?? false}
    on:check={({ detail: checked }) => onChange(checked)}
  />
</GridCell>
