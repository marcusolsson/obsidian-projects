<script lang="ts">
  import { GridCell } from "..";
  import type { GridColDef } from "../../dataGrid";

  import { Autocomplete, TextInput } from "obsidian-svelte";
  import TextLabel from "./TextLabel.svelte";
  import type { Optional } from "src/lib/dataframe/dataframe";

  export let value: Optional<string>;
  export let onChange: (value: Optional<string>) => void;
  export let column: GridColDef;
  export let rowindex: number;
  export let colindex: number;
  export let selected: boolean;

  let edit: boolean = false;

  $: options =
    column.typeConfig?.options?.map((option) => ({
      label: option,
      description: "",
    })) ?? [];
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
  <TextLabel
    slot="read"
    richText={column.typeConfig?.richText ?? false}
    value={value || ""}
  />
  <svelte:fragment slot="edit">
    {#if options.length > 0}
      <Autocomplete
        value={value || ""}
        {options}
        embed
        autoFocus
        on:change={({ detail }) => (value = detail)}
        on:blur={({ detail: event }) => {
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
    {:else}
      <TextInput
        autoFocus
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
    {/if}
  </svelte:fragment>
</GridCell>
