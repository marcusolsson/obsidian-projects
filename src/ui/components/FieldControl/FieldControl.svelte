<script lang="ts">
  import {
    Autocomplete,
    DateInput,
    // DatetimeInput,
    NumberInput,
    Switch,
    TextInput,
  } from "obsidian-svelte";
  import DatetimeInput from "../DatetimeInput.svelte";
  import dayjs from "dayjs";

  import { TagList } from "src/ui/components/TagList";
  import {
    DataFieldType,
    isBoolean,
    isDate,
    isNumber,
    isOptionalList,
    isString,
    type DataField,
    type DataValue,
    type Optional,
  } from "src/lib/dataframe/dataframe";

  export let field: DataField;
  export let value: Optional<DataValue>;
  let cachedValue: Optional<Date> = isDate(value) ? value : null; // store the proposing value
  export let onChange: (value: Optional<DataValue>) => void;
  export let readonly: boolean = false;

  $: options =
    field.typeConfig?.options?.map((option) => ({
      label: option,
      description: "",
    })) ?? [];
</script>

{#if field.type === DataFieldType.Boolean}
  <Switch
    checked={isBoolean(value) ? value : false}
    on:check={({ detail }) => onChange(detail)}
  />
{:else if field.repeated && isOptionalList(value)}
  <TagList edit={!readonly} values={value ?? []} {onChange} />
{:else if field.type === DataFieldType.String}
  {#if options.length > 0}
    <Autocomplete
      value={isString(value) ? value : ""}
      {options}
      on:change={({ detail }) => onChange(detail)}
    />
  {:else}
    <TextInput
      value={isString(value) ? value : ""}
      on:input={({ detail: value }) => onChange(value)}
      {readonly}
    />
  {/if}
{:else if field.type === DataFieldType.Number}
  <NumberInput
    value={isNumber(value) ? value : null}
    on:input={({ detail: value }) =>
      onChange(value !== null ? value : undefined)}
  />
{:else if field.type === DataFieldType.Date}
  {#if field.typeConfig?.time}
    <DatetimeInput
      value={isDate(value) ? value : null}
      on:input={({ detail: value }) => (cachedValue = value)}
      on:blur={() => onChange(cachedValue)}
    />
  {:else}
    <DateInput
      value={isDate(value) ? value : null}
      on:change={({ detail: value }) => (cachedValue = value)}
      on:blur={() => {
        if (!cachedValue) {
          onChange(cachedValue);
          return;
        }
        const cachedDate = dayjs(cachedValue);
        const newDatetime = dayjs(isDate(value) ? value : null)
          .set("year", cachedDate.year())
          .set("month", cachedDate.month())
          .set("date", cachedDate.date());
        onChange(newDatetime.toDate());
      }}
    />
  {/if}
{/if}
