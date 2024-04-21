<script lang="ts">
  import { Button, Icon } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";
  import { TextInput, useClickOutside } from "obsidian-svelte";

  let editing: boolean = false;
  let defaultNewColumnName: string = $i18n.t(
    "components.board.column.placeholder"
  );
  let inputRef: HTMLInputElement;
  $: if (editing && inputRef) {
    inputRef.focus();
    inputRef.select();
  }
  let value: string = "";
  $: error = !onValidate(value);
  export let onColumnAdd: (name: string) => void;
  export let onValidate: (value: string) => boolean;

  const addColumn = () => {
    editing = false;
    if (!error) onColumnAdd(value);
    value = "";
  };

  const escape = () => {
    editing = false;
    value = "";
  };
</script>

<section
  data-id={defaultNewColumnName}
  class="projects--board--column"
  on:click|stopPropagation={() => {
    if (!editing) editing = true;
  }}
  on:keydown|stopPropagation={() => {}}
  use:useClickOutside={() => escape()}
>
  {#if editing}
    <TextInput
      noPadding
      embed
      bind:ref={inputRef}
      bind:value
      placeholder={defaultNewColumnName}
      on:keydown={(event) => {
        if (event.key === "Enter") addColumn();
        if (event.key === "Escape") escape();
      }}
    />
    <span class="button-group">
      <Button
        variant="primary"
        disabled={error}
        on:click={(event) => {
          event.stopPropagation();
          addColumn();
        }}
      >
        {$i18n.t("components.board.column.confirm")}
      </Button>
    </span>
  {:else}
    <span class="add-column">
      <Button variant="plain">
        <Icon name="plus" />
        {$i18n.t("components.board.column.add")}
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
    background-color: var(--background-secondary);
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

  .button-group {
    display: flex;
    justify-content: end;
    gap: var(--size-4-2);
  }
</style>
