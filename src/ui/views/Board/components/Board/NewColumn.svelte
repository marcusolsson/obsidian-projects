<script lang="ts">
  import { Button, Icon } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";
  import { TextInput } from "obsidian-svelte";
  let editing: boolean = false;
  let defaultNewColumnName: string = $i18n.t("views.board.column.placeholder");
  let inputRef: HTMLInputElement;
  $: if (editing && inputRef) {
    inputRef.focus();
    inputRef.select();
  }
  let value: string = "";
  $: error = !onValidate(value);
  export let onColumnAdd: (name: string) => void;
  export let onValidate: (value: string) => boolean;
</script>

<section data-id={defaultNewColumnName} class="projects--board--column">
  {#if editing}
    <TextInput
      noPadding
      embed
      bind:ref={inputRef}
      bind:value
      placeholder={defaultNewColumnName}
      on:keydown={(event) => {
        if (event.key === "Enter") {
          editing = false;
          if (!error) onColumnAdd(value);
          value = "";
        }
        if (event.key === "Escape") editing = false;
      }}
      on:blur={() => {
        editing = false;
        if (!error) onColumnAdd(value);
        value = "";
      }}
    />
  {:else}
    <div>
      <Button
        variant="plain"
        on:click={() => {
          editing = true;
        }}
      >
        <Icon name="plus" />
        {$i18n.t("views.board.column.add")}
      </Button>
    </div>
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
    gap: var(--size-4-2);
    flex-direction: column;

    height: fit-content;
  }

  section:focus-within {
    box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
  }

  div {
    margin: -4px;
  }
</style>
