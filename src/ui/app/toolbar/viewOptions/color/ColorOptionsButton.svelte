<script lang="ts">
  import type { ColorFilterDefinition } from "src/settings/settings";
  import type { DataField } from "src/lib/dataframe/dataframe";
  import ColorOptions from "./ColorOptions.svelte";
  import PopoverButton from "../PopoverButton.svelte";
  import { i18n } from "src/lib/stores/i18n";

  export let value: ColorFilterDefinition | undefined;
  export let onChange: (value: ColorFilterDefinition) => void;

  export let fields: DataField[];
  export let disabled: boolean = false;
</script>

<PopoverButton
  label={$i18n.t("components.color.label")}
  icon="palette"
  count={value?.conditions.length ?? 0}
  {disabled}
>
  <ColorOptions
    filter={value ?? {
      conditions: [],
    }}
    onFilterChange={onChange}
    {fields}
  />
</PopoverButton>
