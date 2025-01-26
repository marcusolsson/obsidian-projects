<script lang="ts">
  import { produce } from "immer";
  import dayjs from "dayjs";
  import {
    Button,
    IconButton,
    Icon,
    Select,
    TextInput,
    NumberInput,
    Checkbox,
    // DateInput,
    // DatetimeInput,
  } from "obsidian-svelte";
  import DateInput from "src/ui/components/DateInput.svelte";
  import DatetimeInput from "src/ui/components/DatetimeInput.svelte";
  import { TagsInput } from "src/ui/components/TagsInput";
  import HorizontalGroup from "src/ui/components/HorizontalGroup/HorizontalGroup.svelte";
  import type { DataField } from "src/lib/dataframe/dataframe";
  import {
    filterOperatorTypes,
    getFilterOperatorType,
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
      if (
        getFilterOperatorType(detail as FilterOperator) !==
        getFilterOperatorType(filter.conditions[i]?.operator)
      ) {
        //TODO: potential type conversion here.
        filter = setValue(filter, i, "");
      }
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
      {#if filterOperatorTypes[condition.operator] === "binary-text"}
        <TextInput
          value={condition.value ?? ""}
          on:blur={handleValueChange(i)}
        />
      {:else if filterOperatorTypes[condition.operator] === "binary-number"}
        <NumberInput
          value={parseFloat(condition.value ?? "")}
          on:blur={handleValueChange(i)}
        />
      {:else if filterOperatorTypes[condition.operator] === "binary-date"}
        {#if field?.typeConfig?.time}
          <DatetimeInput
            value={dayjs(condition.value ?? "").toDate()}
            on:blur={handleValueChange(i)}
          />
        {:else}
          <DateInput
            value={dayjs(condition.value ?? "").toDate()}
            on:blur={handleValueChange(i)}
          />
        {/if}
      {:else if filterOperatorTypes[condition.operator] === "binary-multitext"}
        <TagsInput
          strict={condition.field === "binary-multitext"}
          unique={true}
          value={condition.value ? JSON.parse(condition.value) : []}
          on:change={(event) => {
            filter = setValue(filter, i, event.detail);
            onFilterChange(filter);
          }}
        />
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
