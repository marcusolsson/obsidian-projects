<script lang="ts">
  import {
    Icon,
    IconButton,
    TextInput,
    useClickOutside,
  } from "obsidian-svelte";
  import { createEventDispatcher } from "svelte";

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

  let hovering: boolean = false;
  let editing: boolean = false;

  let inputRef: HTMLInputElement;

  $: if (inputRef && editing) {
    inputRef.focus();
    inputRef.select();
  }

  $: error = !onValidate(label);

  const dispatch = createEventDispatcher<{ rename: string; delete: void }>();
</script>

<!--
	@component

	ViewItem is a button that can be renamed and deleted.
-->
<div
  data-id={id}
  class:active
  class:error
  on:mouseenter={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
  on:focus={() => (hovering = true)}
  on:blur={() => {
    hovering = false;
    editing = false;

    rollback();
  }}
  on:dblclick={() => (editing = true)}
  on:mousedown
  use:useClickOutside={() => {
    editing = false;

    rollback();
  }}
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

          if (!error) {
            fallback = label;

            dispatch("rename", label);
          } else {
            rollback();
          }
        }
      }}
    />
  {:else}
    {label}
  {/if}

  {#if hovering && active}
    <IconButton
      icon="cross"
      size="sm"
      nopadding
      on:click={() => dispatch("delete")}
    />
  {/if}
</div>

<style>
  div {
    display: inline-flex;
    align-items: center;
    gap: 4px;

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
