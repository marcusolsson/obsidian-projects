<script lang="ts">
  import {
    isOptionalBoolean,
    isOptionalDate,
    isOptionalLink,
    isOptionalList,
    isOptionalNumber,
    isOptionalString,
    type OptionalDataValue,
  } from "src/lib/data";

  import GridCell from "./GridCell.svelte";

  import type { GridColDef } from "../data-grid";
  import { GridBooleanCell } from "./GridBooleanCell";
  import { GridDateCell } from "./GridDateCell";
  import { GridNumberCell } from "./GridNumberCell";
  import { GridTextCell } from "./GridTextCell";
  import { GridLinkCell } from "./GridLinkCell";
  import { GridListCell } from "./GridListCell";

  export let value: OptionalDataValue;
  export let onChange: (value: OptionalDataValue) => void;
  export let column: GridColDef;
  export let rowindex: number;
  export let colindex: number;
  export let selected: boolean;
</script>

{#if column.type === "string" && isOptionalString(value)}
  <GridTextCell
    {selected}
    {rowindex}
    {colindex}
    {value}
    {onChange}
    {column}
    on:mousedown
    on:navigate
  />
{:else if column.type === "boolean" && isOptionalBoolean(value)}
  <GridBooleanCell
    {selected}
    {rowindex}
    {colindex}
    {value}
    {onChange}
    {column}
    on:mousedown
    on:navigate
  />
{:else if column.type === "number" && isOptionalNumber(value)}
  <GridNumberCell
    {selected}
    {rowindex}
    {colindex}
    {value}
    {onChange}
    {column}
    on:mousedown
    on:navigate
  />
{:else if column.type === "date" && isOptionalDate(value)}
  <GridDateCell
    {selected}
    {rowindex}
    {colindex}
    {value}
    {onChange}
    {column}
    on:mousedown
    on:navigate
  />
{:else if column.type === "link" && isOptionalLink(value)}
  <GridLinkCell
    {selected}
    {rowindex}
    {colindex}
    {value}
    {onChange}
    {column}
    on:mousedown
    on:navigate
  />
{:else if column.type === "list" && isOptionalList(value)}
  <GridListCell
    {selected}
    {rowindex}
    {colindex}
    {value}
    {onChange}
    {column}
    on:mousedown
    on:navigate
  />
{:else}
  <GridCell
    {rowindex}
    {selected}
    {colindex}
    {column}
    on:mousedown
    on:navigate
  />
{/if}
