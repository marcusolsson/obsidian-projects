<script lang="ts">
  import { Checkbox } from "obsidian-svelte";

  export let id: string;
  export let checked: boolean | null | undefined = undefined;

  let hover: boolean = false;
</script>

<div
  data-id={id}
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
    border-radius: 2px;
    background-color: hsla(var(--interactive-accent-hsl), 0.1);
    padding: 0.2em 0.4em;
    font-size: var(--font-ui-smaller);
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    border-left: 3px solid hsla(var(--interactive-accent-hsl), 0.5);
  }

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
