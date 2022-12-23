<script lang="ts">
  import { Checkbox } from "obsidian-svelte";

  export let checked: boolean | null | undefined = undefined;
  export let color: string | null;

  let hover: boolean = false;
</script>

<div
  on:keypress
  on:click
  on:mouseenter={() => (hover = true)}
  on:mouseleave={() => (hover = false)}
  class:unchecked={checked === undefined}
>
  {#if color}
    <span
      style="background-color: {color}; height: 100%; width: 5px; border-radius: 9999px;"
    />
  {/if}

  <!-- If undefined, no field has been set. -->
  <!-- If null, field has been set, but note doesn't have the property. -->
  {#if checked !== undefined && checked !== null}
    <Checkbox bind:checked on:check />
  {:else if checked === null && hover}
    <Checkbox checked={false} on:check />
  {/if}
  <span>
    <slot />
  </span>
</div>

<style>
  div {
    border-radius: var(--radius-s);
    padding: 0.2em 0.4em;
    font-size: var(--font-ui-smaller);
    width: 100%;
    display: grid;
    grid-template-columns: min-content min-content auto;
    border: 1px solid var(--background-modifier-border);
    background-color: var(--background-primary);
    align-items: center;
    gap: 4px;
  }

  .unchecked {
    grid-template-columns: min-content auto;
  }

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
