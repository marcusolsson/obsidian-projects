<script lang="ts">
  import { Checkbox } from "obsidian-svelte";

  export let checked: boolean | null | undefined = undefined;

  let hover: boolean = false;
</script>

<div
  on:click
  on:mouseenter={() => (hover = true)}
  on:mouseleave={() => (hover = false)}
>
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
    border-radius: 4px;
    border: 1px solid var(--background-modifier-border);
    background-color: var(--background-secondary);
    padding: 0.2em 0.4em;
    font-size: var(--font-ui-small);
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
  }

  div:hover {
    border: 1px solid var(--background-modifier-border-hover);
  }

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
