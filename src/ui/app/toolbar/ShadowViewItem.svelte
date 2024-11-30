<script lang="ts">
  import { Icon, IconButton } from "obsidian-svelte";
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
</script>

<div data-id={id}>
  {#if icon}
    <Icon name={icon} />
  {/if}
  {label}
  {#if active}
    <IconButton icon="chevron-down" size="sm" nopadding />
  {/if}
</div>

<style>
  div {
    visibility: visible;
    border: 1px solid var(--interactive-accent);
    background-color: var(--background-modifier-hover);

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
  }
</style>
