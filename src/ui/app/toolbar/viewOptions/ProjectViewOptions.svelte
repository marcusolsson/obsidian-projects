<script lang="ts">
  import type {
    ColorFilterDefinition,
    FilterDefinition,
    SortDefinition,
    ViewDefinition,
  } from "src/settings/settings";
  import type { DataField } from "src/lib/dataframe/dataframe";
  import FilterOptionsButton from "./filter/FilterOptionsButton.svelte";
  import ColorOptionsButton from "./color/ColorOptionsButton.svelte";
  import SortOptionsButton from "./sort/SortOptionsButton.svelte";

  export let view: ViewDefinition | undefined;
  export let fields: DataField[];

  export let onColorChange: (color: ColorFilterDefinition) => void;
  export let onFilterChange: (filter: FilterDefinition) => void;
  export let onSortChange: (sort: SortDefinition) => void;
</script>

<ColorOptionsButton
  value={view?.colors}
  onChange={onColorChange}
  {fields}
  disabled={!view}
/>

<FilterOptionsButton
  value={view?.filter}
  onChange={onFilterChange}
  {fields}
  disabled={!view}
/>

<SortOptionsButton
  value={view?.sort}
  onChange={onSortChange}
  {fields}
  disabled={!view}
/>
