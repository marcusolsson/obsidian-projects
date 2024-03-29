<script>
  import { Switch } from "../Switch";
  import { useIcon } from "../Icon";
  import { createEventDispatcher } from "svelte";
  /**
   * Specifies the text label.
   */
  export let label;
  let selected = false;
  /**
   * Specifies the icon.
   */
  export let icon = "";
  /**
   * Specifies whether the menu item is checked.
   */
  export let checked = undefined;
  const dispatch = createEventDispatcher();
  $: dispatch("check", checked);
</script>

<div
  class="menu-item"
  class:selected
  on:mouseenter={() => (selected = true)}
  on:mouseleave={() => (selected = false)}
  on:click
  on:keypress
>
  {#if checked !== undefined}
    <Switch {checked} on:check={({ detail: enabled }) => (checked = enabled)} />
  {/if}
  {#if icon}
    <div class="menu-item-icon" use:useIcon={icon} />
  {/if}
  <div class="menu-item-title">{label}</div>
</div>
