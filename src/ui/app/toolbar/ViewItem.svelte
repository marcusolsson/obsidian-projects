<script lang="ts">
  import { Menu } from "obsidian";
  import { Icon, IconButton, TextInput } from "obsidian-svelte";
  import { createEventDispatcher } from "svelte";
  import { i18n } from "src/lib/stores/i18n";

  /**
   * Specifies the button label.
   */
  export let label: string;

  /**
   * Specifies the button id.
   */
  export let id: string;

  /**
   *  Specifies whether the button is active.
   */
  export let active: boolean = false;

  /**
   * Specifies an optional icon.
   */
  export let icon: string = "";

  /**
   * Specifies a function to determine if the label is valid.
   */
  export let onValidate: (name: string) => boolean;

  // Store original value to be able to roll back.
  let fallback: string = label;

  function rollback() {
    label = fallback;
  }

  let editing: boolean = false;

  let inputRef: HTMLInputElement;

  $: if (inputRef && editing) {
    inputRef.focus();
    inputRef.select();
  }

  $: error = !onValidate(label);

  const dispatch = createEventDispatcher<{
    rename: string;
    duplicate: void;
    delete: void;
  }>();
</script>

<!--
	@component

	ViewItem is a button that can be renamed and deleted.
-->
<div
  data-id={id}
  class:active
  class:error
  on:dblclick={() => (editing = true)}
  on:click
  on:keydown
>
  {#if icon}
    <Icon name={icon} />
  {/if}

  {#if editing}
    <TextInput
      noPadding
      embed
      bind:ref={inputRef}
      bind:value={label}
      width={label.length + "ch"}
      on:keydown={(event) => {
        if (event.key === "Enter") {
          editing = false;

          if (fallback == label) {
            return;
          }

          if (!error) {
            fallback = label;

            dispatch("rename", label);
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
        if (editing) {
          editing = false;
          if (!error) {
            fallback = label;

            dispatch("rename", label);
          } else {
            rollback();
          }
        } else {
          return;
        }
      }}
    />
  {:else}
    {label}
  {/if}

  {#if active}
    <IconButton
      icon="chevron-down"
      size="sm"
      nopadding
      onClick={(event) => {
        const menu = new Menu();

        menu.addItem((item) => {
          item
            .setTitle($i18n.t("modals.view.duplicate.title"))
            .setIcon("copy")
            .onClick(() => {
              dispatch("duplicate");
            });
        });

        menu.addItem((item) => {
          item
            .setTitle($i18n.t("modals.view.delete.title"))
            .setIcon("trash")
            .setWarning(true)
            .onClick(() => {
              dispatch("delete");
            });
        });

        menu.showAtMouseEvent(event);
      }}
    />
  {/if}
</div>

<style>
  div {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: var(--size-4-1);

    height: 1.8rem;
    padding: 0 8px;
    min-width: min-content;

    font-size: var(--font-ui-small);
    border-radius: var(--radius-s);

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    border: 1px solid transparent;
  }
  div:hover {
    background-color: var(--background-modifier-hover);
  }
  .active {
    background-color: var(--background-modifier-hover);
  }
  .error {
    border: 1px solid var(--background-modifier-error);
  }
</style>
