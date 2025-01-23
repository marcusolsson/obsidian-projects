<script lang="ts">
  import {
    DataFieldType,
    type DataField,
    type DataValue,
    type Optional,
  } from "src/lib/dataframe/dataframe";
  import { TagList } from "../TagList";

  export let value: Optional<DataValue>;
  export let field: DataField;
</script>

{#if field.type === DataFieldType.String && field.repeated && Array.isArray(value)}
  <TagList richText={field.typeConfig?.richText ?? false} values={value || []} />
{/if}
