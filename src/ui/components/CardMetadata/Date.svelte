<script lang="ts">
  import {
    DataFieldType,
    isDate,
    type DataField,
    type DataValue,
    type Optional,
  } from "src/lib/dataframe/dataframe";

  export let value: Optional<DataValue>;
  export let field: DataField;
</script>

{#if field.type === DataFieldType.Date && !field.repeated && isDate(value)}
  {value.toPlainDateTime().toLocaleString("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })}
{/if}
