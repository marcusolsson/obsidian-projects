<script lang="ts">
  import { Menu, MenuItem } from "obsidian-svelte";
  interface SwitchItem {
    readonly label: string;
    readonly icon?: string;
    readonly value: string;
    readonly enabled: boolean;
  }

  export let items: SwitchItem[];
  export let label: string;
  export let onChange: (value: string, enabled: boolean) => void;

  let ref: HTMLDivElement;

  let isOpen: boolean = false;
</script>

<div
  bind:this={ref}
  class="dropdown"
  on:keypress
  on:click={() => (isOpen = !isOpen)}
>
  {label}
</div>

<Menu anchorEl={ref} open={isOpen} onClose={() => (isOpen = false)}>
  {#each items as { label, icon, value, enabled }}
    <MenuItem
      {icon}
      {label}
      checked={enabled}
      on:check={({ detail: checked }) => onChange(value, checked)}
    />
  {/each}
</Menu>

<style>
  div {
    align-items: center;
    display: inline-flex;
    text-align: start;
  }
</style>
