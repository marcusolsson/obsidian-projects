<script lang="ts">
  import GridCell from "../GridCell.svelte";
  import NumberLabel from "./NumberLabel.svelte";
  import NumberInput from "./NumberInput.svelte";
  import { isNumber, type Optional } from "src/lib/dataframe/dataframe";
  import type { GridColDef } from "../../dataGrid";

  export let value: Optional<number>;
  export let onChange: (value: Optional<number>) => void;
  export let column: GridColDef;
  export let rowindex: number;
  export let colindex: number;
  export let selected: boolean;

  let edit: boolean = false;
</script>

<GridCell
  bind:edit
  bind:selected
  {column}
  on:mousedown
  on:navigate
  {rowindex}
  {colindex}
  onCopy={() => {
    navigator.clipboard.writeText(value?.toString() || "");
  }}
  onCut={() => {
    navigator.clipboard.writeText(value?.toString() || "");
    onChange(undefined);
  }}
  onPaste={async () => {
    onChange(parseFloat(await navigator.clipboard.readText()));
  }}
>
  <svelte:fragment slot="read">
    {#if isNumber(value)}
      <NumberLabel {value} />
    {/if}
  </svelte:fragment>
  <NumberInput
    slot="edit"
    on:blur={(event) => {
      if (
        event.currentTarget instanceof HTMLInputElement &&
        event.relatedTarget instanceof HTMLDivElement &&
        !event.relatedTarget.contains(event.currentTarget)
      ) {
        selected = false;
        edit = false;
      }
    }}
    value={value ?? 0}
    onChange={(value) => {
      onChange(value);
    }}
  />
</GridCell>
