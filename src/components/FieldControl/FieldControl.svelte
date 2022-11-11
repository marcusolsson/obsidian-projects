<script lang="ts">
  import {
    DataFieldType,
    isBoolean,
    isDate,
    isLink,
    isNumber,
    isOptionalList,
    isString,
    type DataValue,
  } from "../../lib/data";

  import { DateInput, TextInput, Switch, NumberInput } from "obsidian-svelte";
  import { TagList } from "../TagList";

  export let type: DataFieldType;
  export let value: DataValue;
  export let onChange: (value: DataValue) => void;
  export let readonly: boolean = false;
</script>

{#if type === DataFieldType.Boolean}
  <Switch
    checked={isBoolean(value) ? value : false}
    on:check={({ detail }) => onChange(detail)}
  />
{:else if type === DataFieldType.String}
  <TextInput
    value={isString(value) ? value : ""}
    on:input={({ detail: value }) => onChange(value)}
    {readonly}
  />
{:else if type === DataFieldType.Number}
  <NumberInput
    value={isNumber(value) ? value : null}
    on:input={({ detail: value }) =>
      onChange(value !== null ? value : undefined)}
  />
{:else if type === DataFieldType.Date}
  <DateInput
    value={isDate(value) ? value : null}
    on:change={({ detail: value }) =>
      onChange(value != null ? value : undefined)}
  />
{:else if type === DataFieldType.List && isOptionalList(value)}
  <TagList edit={true} values={value ?? []} {onChange} />
{:else if type === DataFieldType.Link}
  <TextInput
    value={isLink(value) ? value.linkText : ""}
    on:input={({ detail: val }) => {
      if (isLink(value)) {
        onChange({ ...value, linkText: val });
      }
    }}
  />
{/if}
