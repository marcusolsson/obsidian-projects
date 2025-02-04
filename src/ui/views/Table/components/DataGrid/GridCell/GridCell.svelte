<script lang="ts">
  import { useClickOutside } from "obsidian-svelte";
  import { createEventDispatcher } from "svelte";
  import type { GridColDef } from "../dataGrid";

  import Resizer from "./Resizer.svelte";

  export let selected: boolean = false;
  export let edit: boolean = false;
  export let resizable: boolean = false;
  export let onResize: (width: number) => void = () => {};
  export let onFinalizeResize: (width: number) => void = () => {};
  export let column: Partial<GridColDef>;
  export let rowindex: number;
  export let colindex: number;
  export let columnHeader: boolean = false;
  export let rowHeader: boolean = false;
  export let onEditChange: (value: boolean) => void = (value: boolean) => {
    edit = value;
  };
  export let color: string | null = null;
  export let onCopy: () => void = () => {};
  export let onCut: () => void = () => {};
  export let onPaste: () => void = () => {};

  const dispatch = createEventDispatcher<{
    navigate: [number, number, boolean?];
  }>();

  let hover: boolean = false;

  let ref: HTMLDivElement;

  $: if (selected && ref) {
    ref.focus();
    ref.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }

  function handleClick() {
    if (!column.header && !columnHeader && !rowHeader) {
      selected = true;
    }
  }
  function handleDoubleClick() {
    if (!column.header && !columnHeader && !rowHeader && column.editable) {
      onEditChange(true);
    }
  }
  function handleKeyDown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey) {
      switch (event.key) {
        case "c":
          onCopy();
          break;
        case "x":
          onCut();
          break;
        case "v":
          onPaste();
          break;
      }
    }
    switch (event.key) {
      case "Enter":
        if (edit) {
          onEditChange(false);
          ref.focus();
        } else {
          if (column.editable) onEditChange(true);
        }
        break;
      case "Escape":
        onEditChange(false);
        ref.focus();
        break;
      case "ArrowLeft":
        if (!edit) {
          dispatch("navigate", [colindex - 1, rowindex]);
          event.preventDefault();
        }
        break;
      case "ArrowRight":
        if (!edit) {
          dispatch("navigate", [colindex + 1, rowindex]);
          event.preventDefault();
        }
        break;
      case "ArrowUp":
        if (!edit) {
          dispatch("navigate", [colindex, rowindex - 1]);
          event.preventDefault();
        }
        break;
      case "ArrowDown":
        if (!edit) {
          dispatch("navigate", [colindex, rowindex + 1]);
          event.preventDefault();
        }
        break;
      case "Tab":
        if (event.shiftKey) {
          dispatch("navigate", [colindex - 1, rowindex, true]);
        } else {
          dispatch("navigate", [colindex + 1, rowindex, true]);
        }
        event.preventDefault();
        break;
    }
  }

  function handleBlur(event: FocusEvent) {
    hover = false;

    if (
      event.currentTarget instanceof HTMLDivElement &&
      event.relatedTarget instanceof HTMLElement &&
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      selected = false;
      onEditChange(false);
    }
  }

  function role() {
    if (columnHeader) {
      return "columnheader";
    } else if (rowHeader) {
      return "rowheader";
    } else {
      return "gridcell";
    }
  }
</script>

{#if rowHeader}
  <div
    bind:this={ref}
    role={role()}
    class:rowHeader
    style={`width: ${column.width}px`}
    on:mouseenter={() => (hover = true)}
    on:mouseleave={() => (hover = false)}
    on:mousedown
  >
    {#if $$slots.hover && hover}
      <slot name="hover" />
    {:else}
      <slot name="read" />
    {/if}

    <span
      style="background-color: {color
        ? color
        : 'transparent'}; width: 5px; border-radius: 9999px; position: absolute; right: 4px; height: calc(100% - 8px);"
    />
  </div>
{:else}
  <div
    bind:this={ref}
    role={role()}
    aria-selected={rowHeader || columnHeader ? undefined : selected}
    aria-colindex={colindex}
    class:header={column.header}
    class:selected
    class:rowHeader
    class:columnHeader
    class:pinned={column.pinned}
    style={`width: ${column.width}px`}
    tabindex={!columnHeader && !rowHeader ? 1 : undefined}
    on:click={handleClick}
    on:dblclick={handleDoubleClick}
    on:mousedown
    on:mouseenter={() => (hover = true)}
    on:mouseleave={() => (hover = false)}
    on:focus={() => {
      hover = true;
      selected = true;
    }}
    on:blur={handleBlur}
    on:keydown={handleKeyDown}
    use:useClickOutside={() => {
      onEditChange(false);
      selected = false;
    }}
  >
    {#if $$slots.edit && edit}
      {#if column.editable}
        <slot name="edit" />
      {:else}
        <slot name="read" />
      {/if}
    {:else if $$slots.selected && selected}
      <slot name="selected" />
    {:else if $$slots.hover && hover}
      <slot name="hover" />
    {:else}
      <slot name="read" />
    {/if}

    {#if resizable}
      <Resizer
        width={column.width ?? 180}
        min={100}
        onChange={onResize}
        onFinalize={onFinalizeResize}
      />
    {/if}
  </div>
{/if}

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    background-color: var(--background-primary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);

    width: 100%;
    min-height: 30px;
  }

  .selected {
    box-shadow: 0 0 0 2px inset var(--interactive-accent);
    border-radius: var(--radius-s);
    padding: 0;
  }

  .columnHeader {
    background-color: var(--background-primary-alt);
    font-weight: 500;
    text-align: center;
    justify-content: space-between;
    padding: 0 4px;
  }

  .header {
    background-color: var(--background-primary-alt);
    position: sticky;
    left: 60px;
  }

  .rowHeader {
    left: 0px;
    justify-content: center;
    z-index: 5;
    background-color: var(--background-primary-alt);
    font-weight: 500;
    padding: 3px;
    gap: 4px;
    position: sticky;
  }

  .pinned {
    left: 60px;
    background-color: var(--background-primary-alt);
    position: sticky;
    border-right: 1px solid var(--background-modifier-border-focus);
    z-index: 4;
  }
</style>
