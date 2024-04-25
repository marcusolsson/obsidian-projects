<script lang="ts">
  import type { DataField } from "src/lib/dataframe/dataframe";
  import type { FilterDefinition } from "src/settings/settings";
  import FilterOptions from "./FilterOptions.svelte";
  import PopoverButton from "../PopoverButton.svelte";
  import { i18n } from "src/lib/stores/i18n";

  export let value: FilterDefinition | undefined;
  export let onChange: (value: FilterDefinition) => void;

  export let fields: DataField[];
  export let disabled: boolean = false;
</script>

<PopoverButton
  label={$i18n.t("components.filter.label")}
  icon="filter"
  count={value?.conditions.length ?? 0}
  {disabled}
>
  <FilterOptions
    filter={value ?? {
      conjunction: "and",
      conditions: [],
    }}
    {fields}
    onFilterChange={onChange}
  />
</PopoverButton>
