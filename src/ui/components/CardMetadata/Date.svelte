<script lang="ts">
  import {
    DataFieldType,
    type DataField,
    type DataValue,
    type Optional,
  } from "src/lib/dataframe/dataframe";

  export let value: Optional<DataValue>;
  export let field: DataField;
</script>

{#if field.type === DataFieldType.Date && !field.repeated && value instanceof Date}
  {Intl.DateTimeFormat().format(value)}
{/if}
