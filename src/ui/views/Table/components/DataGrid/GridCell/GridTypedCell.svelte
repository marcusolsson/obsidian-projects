<script lang="ts">
  import {
    isOptionalBoolean,
    isOptionalDate,
    isOptionalList,
    isOptionalNumber,
    isOptionalString,
    type Optional,
    type DataValue,
  } from "src/lib/dataframe/dataframe";

  import GridCell from "./GridCell.svelte";

  import type { GridColDef } from "../dataGrid";
  import { GridBooleanCell } from "./GridBooleanCell";
  import { GridDateCell } from "./GridDateCell";
  import { GridDatetimeCell } from "./GridDatetimeCell";
  import { GridNumberCell } from "./GridNumberCell";
  import { GridTextCell } from "./GridTextCell";
  import { GridListCell } from "./GridListCell";

  export let value: Optional<DataValue>;
  export let onChange: (value: Optional<DataValue>) => void;
  export let column: GridColDef;
  export let rowindex: number;
  export let colindex: number;
  export let selected: boolean;
</script>

{#if column.repeated && isOptionalList(value)}
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
{:else if column.type === "string" && isOptionalString(value)}
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
  {#if column.typeConfig?.time}
    <GridDatetimeCell
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
  {/if}
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
