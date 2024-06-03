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
  let cachedDate: Optional<Date>;
  let cachedDatetime: Optional<Date>;
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
  <DateInput
    value={isDate(value) ? value : null}
    on:change={({ detail: value }) => (cachedDate = value)}
    on:blur={() => onChange(cachedDate)}
  />
{:else if field.type === DataFieldType.Datetime}
  <DatetimeInput
    value={isDate(value) ? value : null}
    on:input={({ detail: value }) => (cachedDatetime = value)}
    on:blur={() => onChange(cachedDatetime)}
  />
{/if}
