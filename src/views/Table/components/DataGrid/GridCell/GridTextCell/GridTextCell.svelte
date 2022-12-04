<script lang="ts">
  import { GridCell } from "..";
  import type { GridColDef } from "../../data-grid";

  import { TextInput } from "obsidian-svelte";
  import TextLabel from "./TextLabel.svelte";
  import type { Optional } from "src/lib/data";

  export let value: Optional<string>;
  export let onChange: (value: Optional<string>) => void;
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
  {rowindex}
  {colindex}
  on:mousedown
  on:navigate
  onCopy={() => {
    navigator.clipboard.writeText(value?.toString() || "");
  }}
  onCut={() => {
    navigator.clipboard.writeText(value?.toString() || "");
    onChange(undefined);
  }}
  onPaste={async () => {
    onChange(await navigator.clipboard.readText());
  }}
>
  <TextLabel slot="read" value={value || ""} />
  <TextInput
    autoFocus
    slot="edit"
    value={value || ""}
    embed
    width="100%"
    on:input={({ detail }) => (value = detail)}
    on:blur={(event) => {
      if (
        event.currentTarget instanceof HTMLInputElement &&
        event.relatedTarget instanceof HTMLDivElement &&
        !event.relatedTarget.contains(event.currentTarget)
      ) {
        selected = false;
        edit = false;
      }

      onChange(value);
    }}
  />
</GridCell>
