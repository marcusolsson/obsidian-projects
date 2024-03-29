<script lang="ts">
  import { Switch } from "src/ui/mocks/obsidian-svelte";
  import {
    DataFieldType,
    type DataField,
    type DataValue,
    type Optional,
  } from "src/lib/dataframe/dataframe";

  export let value: Optional<DataValue>;
  export let field: DataField;
</script>

{#if field.type === DataFieldType.Boolean && !field.repeated && typeof value === "boolean"}
  <Switch checked={value} disabled />
{/if}
