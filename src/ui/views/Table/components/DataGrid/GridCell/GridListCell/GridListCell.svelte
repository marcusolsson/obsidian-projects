<script lang="ts">
  import { TagList } from "src/ui/components/TagList";
  import type { DataValue, Optional } from "src/lib/dataframe/dataframe";
  import { GridCell } from "..";
  import type { GridColDef } from "../../dataGrid";

  export let value: Optional<Optional<DataValue>[]>;
  export let onChange: (values: Optional<DataValue>[]) => void;
  export let column: GridColDef;
  export let rowindex: number;
  export let colindex: number;
  export let selected: boolean;
</script>

<GridCell {selected} {rowindex} {colindex} {column} on:mousedown on:navigate>
  <TagList
    slot="read"
    edit={false}
    values={value || []}
    richText={column.typeConfig?.richText ?? false}
  />
  <TagList slot="edit" edit={true} values={value || []} {onChange} />
</GridCell>
