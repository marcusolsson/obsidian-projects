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
  } from "obsidian-svelte";
  import HorizontalGroup from "src/ui/components/HorizontalGroup/HorizontalGroup.svelte";
  import { DataFieldType, type DataField } from "src/lib/data";
  import {
    filterOperatorTypes,
    isNumberFilterOperator,
    isStringFilterOperator,
    type BaseFilterOperator,
    type BooleanFilterOperator,
    type FilterDefinition,
    type FilterOperator,
    type NumberFilterOperator,
    type StringFilterOperator,
  } from "src/settings/settings";

  export let filter: FilterDefinition;
  export let fields: DataField[];
  export let onFilterChange: (filter: FilterDefinition) => void;

  $: fieldOptions = fields.map((field) => ({
    label: field.name,
    value: field.name,
  }));

  const handleFieldChange =
    (i: number) =>
    ({ detail }: CustomEvent<string>) => {
      filter = produce(filter, (draft) => {
        draft.conditions = draft.conditions.map((cond, idx) =>
          idx !== i
            ? cond
            : {
                ...cond,
                field: detail,
                operator: "is-empty",
              }
        );
      });
      onFilterChange(filter);
    };

  const handleOperatorChange =
    (i: number) =>
    ({ detail }: CustomEvent<string>) => {
      filter = produce(filter, (draft) => {
        draft.conditions = draft.conditions.map((cond, idx) =>
          idx !== i ? cond : { ...cond, operator: detail as FilterOperator }
        );
      });
      onFilterChange(filter);
    };

  const handleValueChange = (i: number) => (event: FocusEvent) => {
    if (event.currentTarget instanceof HTMLInputElement) {
      const inputValue = event.currentTarget.value;
      filter = produce(filter, (draft) => {
        draft.conditions = draft.conditions.map((cond, idx) =>
          idx !== i ? cond : { ...cond, value: inputValue }
        );
      });
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

    filter = produce(filter, (draft) => {
      draft.conditions.splice(i, 1);
    });
    onFilterChange(filter);
  };

  function handleConditionAdd() {
    filter = produce(filter, (draft) => {
      draft.conditions.push({
        field: fields.at(0)?.name ?? "",
        operator: "is-not-empty",
        enabled: true,
      });
    });
    onFilterChange(filter);
  }

  function getFieldByName(fieldName: string): DataField | undefined {
    return fields.find((field) => field.name === fieldName);
  }

  function getOperatorsByField(field: DataField): Array<{
    label: string;
    value: FilterOperator;
  }> {
    const baseOperators: Array<{
      label: string;
      value: BaseFilterOperator;
    }> = [
      { label: "is not empty", value: "is-not-empty" },
      { label: "is empty", value: "is-empty" },
    ];

    if (field.repeated) {
      return baseOperators;
    }

    switch (field.type) {
      case DataFieldType.String:
        const stringOps: Array<{
          label: string;
          value: StringFilterOperator;
        }> = [
          { label: "is", value: "is" },
          { label: "is not", value: "is-not" },
          { label: "contains", value: "contains" },
          { label: "does not contain", value: "not-contains" },
        ];
        return [...baseOperators, ...stringOps];
      case DataFieldType.Boolean:
        const booleanOps: Array<{
          label: string;
          value: BooleanFilterOperator;
        }> = [
          { label: "is checked", value: "is-checked" },
          { label: "is not checked", value: "is-not-checked" },
        ];
        return [...baseOperators, ...booleanOps];
      case DataFieldType.Number:
        const numberOps: Array<{
          label: string;
          value: NumberFilterOperator;
        }> = [
          { label: "=", value: "eq" },
          { label: "≠", value: "neq" },
          { label: "<", value: "lt" },
          { label: ">", value: "gt" },
          { label: "≤", value: "lte" },
          { label: "≥", value: "gte" },
        ];
        return [...baseOperators, ...numberOps];
    }

    return baseOperators;
  }
</script>

<div style="display: flex; flex-direction: column; gap: 8px;">
  {#each filter.conditions as condition, i}
    {@const field = getFieldByName(condition.field)}
    <HorizontalGroup>
      <div class="setting-item-name" style="width: 5ch">
        {i === 0 ? "Where" : "and"}
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
      ><Icon name="plus" />Add condition</Button
    >
  </HorizontalGroup>
</div>
