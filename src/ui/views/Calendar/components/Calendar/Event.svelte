<script lang="ts">
  import { Checkbox } from "obsidian-svelte";
  import ColorPill from "./ColorPill.svelte";
  import Ellipsis from "./Ellipsis.svelte";

  /**
   * Specifies an optional color of the calendar event.
   */
  export let color: string | null = null;

  /**
   * Specifies an optional checkbox.
   *
   * If undefined, no field has been set.
   * If null, field has been set, but note doesn't have the property.
   */
  export let checked: boolean | null | undefined = undefined;

  /**
   * Internal hover state.
   */
  let hover: boolean = false;
</script>

<div on:mouseenter={() => (hover = true)} on:mouseleave={() => (hover = false)}>
  {#if color}
    <ColorPill {color} />
  {/if}

  {#if checked !== undefined && checked !== null}
    <Checkbox bind:checked on:check />
  {:else if checked === null && hover}
    <Checkbox checked={false} on:check />
  {/if}

  <Ellipsis>
    <slot />
  </Ellipsis>
</div>

<style>
  div {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 0.2em 0.4em;
    font-size: var(--font-ui-smaller);
    border: 1px solid var(--background-modifier-border);
    background-color: var(--background-primary);
    border-radius: var(--radius-s);
  }

  /* Remove default checkbox margin. */
  div :global(input[type="checkbox"]) {
    margin: 0;
  }
</style>
