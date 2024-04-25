<script lang="ts">
  import produce from "immer";
  import {
    Button,
    IconButton,
    Icon,
    Select,
    TextInput,
    NumberInput,
    Checkbox,
    // DateInput, //use native date input temporarily,
  } from "obsidian-svelte";
  import { TagsInput } from "src/ui/components/TagsInput";
  import HorizontalGroup from "src/ui/components/HorizontalGroup/HorizontalGroup.svelte";
  import type { DataField } from "src/lib/dataframe/dataframe";
  import {
    filterOperatorTypes,
    isNumberFilterOperator,
    isStringFilterOperator,
    isDateFilterOperator,
    isListFilterOperator,
    type FilterDefinition,
    type FilterOperator,
  } from "src/settings/settings";
  import { fieldsToSelectOptions } from "../helpers";
  import {
    addCondition,
    getFieldByName,
    getOperatorsByField,
    removeCondition,
    setField,
    setOperator,
    setValue,
  } from "./helpers";
  import { i18n } from "src/lib/stores/i18n";

  export let filter: FilterDefinition;
  export let fields: DataField[];
  export let onFilterChange: (filter: FilterDefinition) => void;

  $: fieldOptions = fieldsToSelectOptions(fields);

  const handleConjunctionChange = ({ detail }: CustomEvent<string>) => {
    filter = { ...filter, conjunction: detail as "and" | "or" };
    onFilterChange(filter);
  };

  const handleFieldChange =
    (i: number) =>
    ({ detail }: CustomEvent<string>) => {
      filter = setField(filter, i, detail);
      onFilterChange(filter);
    };

  const handleOperatorChange =
    (i: number) =>
    ({ detail }: CustomEvent<string>) => {
      filter = setOperator(filter, i, detail as FilterOperator);
      onFilterChange(filter);
    };

  const handleValueChange = (i: number) => (event: FocusEvent) => {
    if (event.currentTarget instanceof HTMLInputElement) {
      filter = setValue(filter, i, event.currentTarget.value);
      onFilterChange(filter);
    }
  };

  const handleStatusChange =
    (i: number) =>
    ({ detail }: CustomEvent<boolean>) => {
      filter = produce(filter, (draft) => {
        draft.conditions = draft.conditions.map((cond, idx) =>
          idx !== i ? cond : { ...cond, enabled: detail as boolean }
        );
      });
      onFilterChange(filter);
    };

  const handleConditionRemove = (i: number) => (event: MouseEvent) => {
    event.stopPropagation();
    filter = removeCondition(filter, i);
    onFilterChange(filter);
  };

  function handleConditionAdd() {
    filter = addCondition(filter, fields);
    onFilterChange(filter);
  }
</script>

<div style="display: flex; flex-direction: column; gap: 8px;">
  {#each filter.conditions as condition, i}
    {@const field = getFieldByName(fields, condition.field)}
    <HorizontalGroup>
      <div class="setting-item-name" style="width: 8ch">
        {#if i === 0}
          {$i18n.t("components.filter.where")}
        {:else}
          <Select
            value={filter.conjunction ?? "and"}
            disabled={i !== 1}
            options={[
              { label: $i18n.t("components.filter.and"), value: "and" },
              { label: $i18n.t("components.filter.or"), value: "or" },
            ]}
            on:change={handleConjunctionChange}
          />
        {/if}
      </div>
      <Select
        value={condition.field}
        options={fieldOptions}
        on:change={handleFieldChange(i)}
      />
      <Select
        value={condition.operator}
        on:change={handleOperatorChange(i)}
        options={field ? getOperatorsByField(field) : []}
      />
      {#if filterOperatorTypes[condition.operator] === "binary"}
        {#if isStringFilterOperator(condition.operator)}
          <TextInput
            value={condition.value ?? ""}
            on:blur={handleValueChange(i)}
          />
        {:else if isNumberFilterOperator(condition.operator)}
          <NumberInput
            value={parseFloat(condition.value ?? "")}
            on:blur={handleValueChange(i)}
          />
        {:else if isDateFilterOperator(condition.operator)}
          <input
            type="date"
            value={condition.value ?? ""}
            on:blur={handleValueChange(i)}
            max="9999-12-31"
          />
        {:else if isListFilterOperator(condition.operator)}
          <TagsInput
            strict={condition.field === "tags"}
            unique={true}
            value={JSON.parse(condition.value ?? "[]")}
            on:change={(event) => {
              filter = setValue(filter, i, event.detail);
              onFilterChange(filter);
            }}
          />
        {/if}
      {/if}
      <Checkbox
        checked={condition?.enabled ?? true}
        on:check={handleStatusChange(i)}
      />
      <IconButton icon="trash" onClick={handleConditionRemove(i)} />
    </HorizontalGroup>
  {/each}
  <HorizontalGroup>
    <Button variant="plain" on:click={handleConditionAdd}
      ><Icon name="plus" />{$i18n.t("components.filter.add")}</Button
    >
  </HorizontalGroup>
</div>
