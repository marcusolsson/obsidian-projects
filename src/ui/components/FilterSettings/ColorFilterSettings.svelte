<script lang="ts">
  import produce from "immer";
  import { dndzone } from "svelte-dnd-action";
  import { v4 as uuidv4 } from "uuid";
  import {
    Button,
    IconButton,
    Icon,
    Select,
    TextInput,
    NumberInput,
    ColorInput,
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
    type ColorFilterDefinition,
    type ColorRule,
    type FilterOperator,
    type NumberFilterOperator,
    type StringFilterOperator,
  } from "src/settings/settings";

  export let filter: ColorFilterDefinition;
  export let fields: DataField[];
  export let onFilterChange: (filter: ColorFilterDefinition) => void;

  $: fieldOptions = fields.map((field) => ({
    label: field.name,
    value: field.name,
  }));

  type ColorRuleWithId = ColorRule & { readonly id: string };
  let conditions: ColorRuleWithId[];
  $: conditions = filter.conditions.map((cond) => ({ ...cond, id: uuidv4() }));

  const handleColorChange = (i: number) => (event: Event) => {
    if (event.currentTarget instanceof HTMLInputElement) {
      const inputValue = event.currentTarget.value;
      filter = produce(filter, (draft) => {
        draft.conditions = draft.conditions.map((cond, idx) =>
          idx !== i ? cond : { ...cond, color: inputValue }
        );
      });
      onFilterChange(filter);
    }
  };

  const handleFieldChange =
    (i: number) =>
    ({ detail }: CustomEvent<string>) => {
      filter = produce(filter, (draft) => {
        draft.conditions = draft.conditions.map((cond, idx) =>
          idx !== i
            ? cond
            : {
                ...cond,
                condition: {
                  ...cond.condition,
                  field: detail,
                  operator: "is-empty",
                },
              }
        );
      });
      onFilterChange(filter);
    };

  const handleOperatorChange =
    (i: number) =>
    ({ detail }: CustomEvent<string>) => {
      filter = produce(filter, (draft) => {
        draft.conditions = draft.conditions.map<ColorRule>((cond, idx) =>
          idx !== i
            ? cond
            : {
                ...cond,
                condition: {
                  ...cond.condition,
                  operator: detail as FilterOperator,
                },
              }
        );
      });
      onFilterChange(filter);
    };

  const handleValueChange = (i: number) => (event: FocusEvent) => {
    if (event.currentTarget instanceof HTMLInputElement) {
      const inputValue = event.currentTarget.value;
      filter = produce(filter, (draft) => {
        draft.conditions = draft.conditions.map((cond, idx) =>
          idx !== i
            ? cond
            : {
                ...cond,
                condition: {
                  ...cond.condition,
                  value: inputValue,
                },
              }
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
          idx !== i
            ? cond
            : {
                ...cond,
                condition: {
                  ...cond.condition,
                  enabled: detail,
                },
              }
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
        color: "#a882ff", // Obsidian purple
        condition: {
          field: fields.at(0)?.name ?? "",
          operator: "is-not-empty",
          enabled: true,
        },
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

  const flipDurationMs = 200;

  function handleDndConsider(e: CustomEvent<DndEvent<ColorRuleWithId>>) {
    conditions = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<ColorRuleWithId>>) {
    filter = produce(filter, (draft) => {
      draft.conditions = e.detail.items.map((cond) => ({
        color: cond.color,
        condition: cond.condition,
      }));
    });
    onFilterChange(filter);
  }
</script>

<div style="display: flex; flex-direction: column; gap: 8px;">
  <div
    style="display: flex; flex-direction: column; gap: 8px;"
    use:dndzone={{
      type: "color conditions",
      items: conditions,
      flipDurationMs,
      dropTargetStyle: {
        outline: "none",
        borderRadius: "5px",
        background: "hsla(var(--interactive-accent-hsl), 0.3)",
        transition: "all 150ms easy-in-out",
      },
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each conditions as condition, i (condition.id)}
      {@const field = getFieldByName(condition.condition.field)}
      <HorizontalGroup>
        <Icon name="grip-vertical" />
        <ColorInput value={condition.color} on:change={handleColorChange(i)} />
        <div class="setting-item-name" style="width: 5ch">Where</div>
        <Select
          value={condition.condition.field}
          options={fieldOptions}
          on:change={handleFieldChange(i)}
        />
        <Select
          value={condition.condition.operator}
          on:change={handleOperatorChange(i)}
          options={field ? getOperatorsByField(field) : []}
        />
        {#if filterOperatorTypes[condition.condition.operator] === "binary"}
          {#if isStringFilterOperator(condition.condition.operator)}
            <TextInput
              value={condition.condition.value ?? ""}
              on:blur={handleValueChange(i)}
            />
          {:else if isNumberFilterOperator(condition.condition.operator)}
            <NumberInput
              value={parseFloat(condition.condition.value ?? "")}
              on:blur={handleValueChange(i)}
            />
          {/if}
        {/if}
        <Checkbox
          checked={condition.condition?.enabled ?? true}
          on:check={handleStatusChange(i)}
        />
        <IconButton icon="trash" onClick={handleConditionRemove(i)} />
      </HorizontalGroup>
    {/each}
  </div>
  <HorizontalGroup>
    <Button variant="plain" on:click={handleConditionAdd}
      ><Icon name="plus" />Add color</Button
    >
  </HorizontalGroup>
</div>
