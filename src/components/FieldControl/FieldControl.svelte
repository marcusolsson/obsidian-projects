<script lang="ts">
  import {
    Autocomplete,
    DateInput,
    NumberInput,
    Switch,
    TextInput,
  } from "obsidian-svelte";

  import { TagList } from "src/components/TagList";
  import {
    DataFieldType,
    isBoolean,
    isDate,
    isLink,
    isNumber,
    isOptionalList,
    isString,
    type DataField,
    type DataValue,
    type Optional,
  } from "src/lib/data";

  export let field: DataField;
  export let value: Optional<DataValue>;
  export let onChange: (value: Optional<DataValue>) => void;
  export let readonly: boolean = false;

  $: options = ((field.typeConfig?.["options"] ?? []) as string[]).map(
    (option) => ({
      label: option,
      description: "",
    })
  );
</script>

{#if field.type === DataFieldType.Boolean}
  <Switch
    checked={isBoolean(value) ? value : false}
    on:check={({ detail }) => onChange(detail)}
  />
{:else if field.repeated && isOptionalList(value)}
  <TagList edit={true} values={value ?? []} {onChange} />
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
    on:change={({ detail: value }) =>
      onChange(value != null ? value : undefined)}
  />
{:else if field.type === DataFieldType.Link}
  <TextInput
    value={isLink(value) ? value.linkText : ""}
    on:input={({ detail: val }) => {
      if (isLink(value)) {
        onChange({ ...value, linkText: val });
      }
    }}
  />
{/if}
