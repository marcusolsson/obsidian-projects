<script lang="ts">
  import type { DataField } from "src/lib/dataframe/dataframe";
  import type { FilterDefinition } from "src/settings/settings";
  import FilterOptions from "./FilterOptions.svelte";
  import PopoverButton from "../PopoverButton.svelte";

  export let value: FilterDefinition | undefined;
  export let onChange: (value: FilterDefinition) => void;

  export let fields: DataField[];
  export let disabled: boolean = false;
</script>

<PopoverButton
  label="Filter"
  icon="filter"
  count={value?.conditions.length ?? 0}
  {disabled}
>
  <FilterOptions
    filter={value ?? {
      conditions: [],
    }}
    {fields}
    onFilterChange={onChange}
  />
</PopoverButton>
