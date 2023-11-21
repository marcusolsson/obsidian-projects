<script lang="ts">
  import { Button, Icon } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";
  import { TextInput } from "obsidian-svelte";

  let editing: boolean = false;
  let defaultNewColumnName: string = "New status";
  let inputRef: HTMLInputElement;
  $: if (editing && inputRef) {
    inputRef.focus();
    inputRef.select();
  }

  let value: string = defaultNewColumnName;
  let fallback: string = value;
  function rollback() {
    value = fallback;
  }

  $: error = !onValidate(value);

  export let onColumnAdd: (name: string) => void;
  export let onValidate: (value: string) => boolean;
</script>

{#if editing}
  <section data-id={defaultNewColumnName} class="projects--board--column">
    <TextInput
      noPadding
      embed
      bind:ref={inputRef}
      bind:value
      on:keydown={(event) => {
        if (event.key === "Enter") {
          editing = false;

          if (fallback == value) {
            return;
          }

          if (!error) {
            fallback = value;
            onColumnAdd(value);
          } else {
            rollback();
          }
        }
        if (event.key === "Escape") {
          editing = false;
          rollback();
        }
      }}
      on:blur={() => {
        editing = false;
        if (!error) {
          fallback = value;
          onColumnAdd(value);
        } else {
          rollback();
        }
      }}
    />
    <div class="projects--board--card-list" />
    <span>
      <Button disabled={true} variant="plain">
        <Icon name="plus" />
        {$i18n.t("views.board.note.add")}
      </Button>
    </span>
  </section>
{:else}
  <Button
    variant="plain"
    on:click={() => {
      editing = true;
    }}
  >
    <Icon name="plus" />
    {"new-option"}
  </Button>
{/if}

<style>
  span {
    display: inline-flex;
    align-content: center;
    justify-content: center;
    border-radius: var(--button-radius);
  }

  span:focus-within {
    box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
  }
</style>
