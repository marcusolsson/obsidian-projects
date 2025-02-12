<script lang="ts">
  import { Button, Icon } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";
  import { TextInput, useClickOutside } from "obsidian-svelte";

  let editing: boolean = false;
  let inputRef: HTMLInputElement;
  $: if (editing && inputRef) {
    inputRef.focus();
    inputRef.select();
  }

  let placeholder: string = $i18n.t("components.board.column.add.placeholder");
  let value: string = "";

  export let fieldError: string = "";
  $: tooltip = fieldError
    ? $i18n.t(`components.board.column.add.${fieldError}`)
    : "";

  export let onColumnAdd: (name: string) => void;
  export let onValidate: (value: string) => boolean;

  const addColumn = () => {
    editing = false;
    if (onValidate(value)) onColumnAdd(value);
    value = "";
  };

  const escape = () => {
    editing = false;
    value = "";
  };

  export let onEdit: (editing: boolean) => void;
  $: onEdit(editing);
</script>

<section
  data-id={placeholder}
  class="projects--board--column"
  on:click|stopPropagation={() => {
    if (!editing) editing = true;
  }}
  on:keydown|stopPropagation={() => {}}
  use:useClickOutside={() => addColumn()}
>
  {#if editing}
    <TextInput
      noPadding
      embed
      bind:ref={inputRef}
      bind:value
      {placeholder}
      on:keydown={(event) => {
        if (event.key === "Enter") addColumn();
        if (event.key === "Escape") escape();
      }}
    />
  {:else}
    <span class="add-column">
      <Button variant="plain" disabled={!!fieldError} {tooltip}>
        <Icon name="plus" />
        {$i18n.t("components.board.column.add.name")}
      </Button>
    </span>
  {/if}
</section>

<style>
  /* Styled as a board column */
  section {
    margin-top: 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
    background-color: var(--background-primary-alt);
    display: flex;
    flex-direction: column;
    row-gap: var(--size-4-2);

    height: fit-content;
  }

  section:focus-within {
    box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
  }

  .add-column {
    margin: -4px;
  }
</style>
