<script lang="ts">
  import {
    Autocomplete,
    // DateInput,
    // DatetimeInput,
    NumberInput,
    Switch,
    TextInput,
  } from "obsidian-svelte";
  import DateInput from "../DateInput.svelte";
  import DatetimeInput from "../DatetimeInput.svelte";
  import { Temporal } from "temporal-polyfill";

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
  let cachedValue: Optional<Temporal.ZonedDateTime> = isDate(value)
    ? value
    : null; // store the proposing value
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
      value={isDate(value) ? value.toPlainDateTime() : null}
      on:change={({ detail: value }) => {
        if (value) {
          cachedValue = cachedValue
            ? cachedValue.with({
                year: value.year,
                month: value.month,
                day: value.day,
                hour: value.hour,
                minute: value.minute,
                second: value.second,
              })
            : value.toZonedDateTime(Temporal.Now.timeZoneId()); // to local timezone
        } else {
          cachedValue = null;
        }
      }}
      on:blur={() => onChange(cachedValue)}
    />
  {:else}
    <DateInput
      value={isDate(value) ? value.toPlainDate() : null}
      on:change={({ detail: value }) => {
        if (value) {
          cachedValue = cachedValue
            ? cachedValue.with({
                year: value.year,
                month: value.month,
                day: value.day,
              })
            : value.toZonedDateTime(Temporal.Now.timeZoneId()); // to local timezone
        } else {
          cachedValue = null;
        }
      }}
      on:blur={() => {
        if (!cachedValue || !isDate(value)) {
          onChange(cachedValue);
          return;
        }
        onChange(
          value.with({
            year: cachedValue.year,
            month: cachedValue.month,
            day: cachedValue.day,
          })
        );
      }}
    />
  {/if}
{/if}
