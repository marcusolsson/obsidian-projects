<script lang="ts">
  import { Button, IconButton, Icon, Select, Checkbox } from "obsidian-svelte";
  import HorizontalGroup from "src/ui/components/HorizontalGroup/HorizontalGroup.svelte";
  import type { DataField } from "src/lib/dataframe/dataframe";
  import type { SortDefinition } from "src/settings/settings";
  import {
    addCriterium,
    getFieldByName,
    getOrderByField,
    removeCriterium,
    setEnabled,
    setField,
    setOrder,
  } from "./helpers";
  import { fieldsToSelectOptions } from "../helpers";
  import { i18n } from "src/lib/stores/i18n";

  export let value: SortDefinition;
  export let onChange: (value: SortDefinition) => void;
  export let fields: DataField[];

  $: fieldOptions = fieldsToSelectOptions(fields);

  const handleFieldChange =
    (i: number) =>
    ({ detail }: CustomEvent<string>) => {
      value = setField(value, i, detail);
      onChange(value);
    };

  const handleOrderChange =
    (i: number) =>
    ({ detail }: CustomEvent<string>) => {
      if (detail === "asc" || detail === "desc") {
        value = setOrder(value, i, detail);
        onChange(value);
      }
    };

  const handleStatusChange =
    (i: number) =>
    ({ detail }: CustomEvent<boolean>) => {
      value = setEnabled(value, i, detail);
      onChange(value);
    };

  const handleConditionRemove = (i: number) => (event: MouseEvent) => {
    event.stopPropagation();
    value = removeCriterium(value, i);
    onChange(value);
  };

  const handleConditionAdd = () => {
    value = addCriterium(value, fields);
    onChange(value);
  };
</script>

<div style="display: flex; flex-direction: column; gap: 8px;">
  {#each value.criteria as criterium, i}
    {@const field = getFieldByName(fields, criterium.field)}

    <HorizontalGroup>
      <Select
        value={criterium.field}
        options={fieldOptions}
        on:change={handleFieldChange(i)}
      />
      <Select
        value={criterium.order}
        on:change={handleOrderChange(i)}
        options={field ? getOrderByField(field) : []}
      />
      <Checkbox checked={criterium.enabled} on:check={handleStatusChange(i)} />
      <IconButton icon="trash" onClick={handleConditionRemove(i)} />
    </HorizontalGroup>
  {/each}
  <HorizontalGroup>
    <Button variant="plain" on:click={handleConditionAdd}
      ><Icon name="plus" />{$i18n.t("components.sort.add")}</Button
    >
  </HorizontalGroup>
</div>
