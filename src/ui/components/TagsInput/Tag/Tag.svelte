<script lang="ts">
  import { IconButton } from "obsidian-svelte";
  import { Menu } from "obsidian";
  import type { DataValue } from "src/lib/dataframe/dataframe";
  import { createEventDispatcher } from "svelte";
  import { TagInput } from "../TagInput";
  import { i18n } from "src/lib/stores/i18n";

  export let tag: DataValue;
  export let selected: boolean = false;
  export let editing: boolean = false;
  export let duplicate: boolean = false;

  let ref: HTMLDivElement;

  $: if (ref && selected) {
    ref.focus();
  }

  function handleContextMenu(event: MouseEvent) {
    const menu = new Menu();
    menu.addItem((item) => {
      item
        .setTitle($i18n.t("components.tag.edit"))
        .setIcon("edit")
        .onClick((event) => {
          menu.close();
          dispatch("edit");
          event.stopPropagation();
          event.preventDefault();
        });
    });
    menu.addSeparator();
    menu.addItem((item) => {
      item
        .setTitle($i18n.t("components.tag.remove"))
        .setIcon("trash-2")
        .setWarning(true)
        .onClick((event) => {
          menu.close();
          dispatch("delete");
          event.stopPropagation();
          event.preventDefault();
        });
    });
    menu.showAtMouseEvent(event);
  }

  const dispatch = createEventDispatcher<{
    edit: void;
    input: string;
    update: DataValue;
    escape: void;
    delete: void;
    navigatePrev: void;
    navigateNext: void;
  }>();

  export let handleClick: (event: MouseEvent) => void;
</script>

{#if editing}
  <TagInput
    bind:ref
    value={tag?.toString() ?? ""}
    on:submit={(event) => {
      dispatch("update", event.detail);
      editing = false;
    }}
    on:escape={() => {
      dispatch("escape");
      editing = false;
    }}
  />
{:else}
  <div
    class="tag"
    class:duplicate
    tabindex="-1"
    bind:this={ref}
    on:click={handleClick}
    on:dblclick={() => {
      dispatch("edit");
    }}
    on:contextmenu={handleContextMenu}
    on:keydown={(event) => {
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          dispatch("edit");
          break;
        case "Delete":
          dispatch("delete");
          break;
        case "ArrowLeft":
          dispatch("navigatePrev");
          break;
        case "ArrowRight":
          dispatch("navigateNext");
          break;
        case "ArrowUp":
          dispatch("navigatePrev");
          break;
        case "ArrowDown":
          dispatch("navigateNext");
          break;
        case "Backspace":
          dispatch("navigatePrev");
          dispatch("delete");
          break;
      }
    }}
  >
    {tag}
    <IconButton
      icon="cross"
      size="xs"
      nopadding
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        dispatch("delete");
      }}
    />
  </div>
{/if}

<style>
  .tag {
    background-color: var(--tag-background);
    border: var(--tag-border-width) solid var(--tag-border-color);

    border-radius: var(--tag-radius);
    color: var(--tag-color);
    font-size: var(--tag-size);
    text-decoration: var(--tag-decoration);
    padding: var(--tag-padding-y) var(--tag-padding-x);
    line-height: 1;

    display: inline-flex;
    align-items: center;
    gap: var(--size-4-1);
  }

  .tag:hover {
    cursor: var(--cursor-link);
    background-color: var(--tag-background-hover);
    border: var(--tag-border-width) solid var(--tag-border-color-hover);
    color: var(--tag-color-hover);
    text-decoration: var(--tag-decoration-hover);
  }

  .tag:focus {
    border-radius: var(--pill-radius);
    left: var(--pill-focus-left-adjust);
    height: 100%;
    box-shadow: 0 0 0 1px var(--background-modifier-border-focus),
      inset 0 0 0 1px var(--background-modifier-border-focus);
  }

  .duplicate {
    animation: multi-select-highlight 2000ms ease-in;
  }
</style>
