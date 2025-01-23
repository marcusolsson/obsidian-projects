<script lang="ts">
  import { IconButton, Tag } from "obsidian-svelte";
  import {
    isString,
    type DataValue,
    type Optional,
  } from "src/lib/dataframe/dataframe";

  import { app } from "src/lib/stores/obsidian";
  import { InputDialogModal } from "src/ui/modals/inputDialog";
  import RichTextTag from "src/ui/components/TagList/RichTextTag.svelte";

  export let values: Optional<DataValue>[];
  export let richText: boolean = false;
  export let edit: boolean = false;

  export let onChange: (values: Optional<DataValue>[]) => void = () => {};

  $: stringValues = values.filter(isString);
</script>

<div class:edit>
  {#if edit}
    {#each stringValues as value, i}
      <Tag>
        {value}
        <IconButton
          icon="cross"
          size="xs"
          nopadding
          onClick={() => {
            onChange(values.filter((_, j) => i !== j));
          }}
        />
      </Tag>
    {/each}
    <IconButton
      icon="plus"
      nopadding
      onClick={() => {
        new InputDialogModal($app, "Add list item", "Add", (value) => {
          onChange([...values, value]);
        }).open();
      }}
    />
  {:else}
    {#each values as value}
      <RichTextTag {richText} value={value?.toString() ?? ""} />
    {/each}
  {/if}
</div>

<style>
  div {
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
    padding: 4px;
  }

  .edit {
    flex-wrap: wrap;
  }
</style>
