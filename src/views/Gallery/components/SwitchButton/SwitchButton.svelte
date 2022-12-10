<script lang="ts">
  import { Typography } from "obsidian-svelte";
  import Icon from "obsidian-svelte/Icon/Icon.svelte";
  /**
   * Specifies the variant of the button.
   */
  export let variant = "default";
  /**
   * Specifies whether the button is disabled.
   */
  export let disabled = false;
  /**
   * Specifies the text to display when hovering the button.
   */
  export let tooltip = "";
  /**
   * Specifies the icon on the button.
   */
  export let icon: string = "slash";
  /**
   * Specifies the icon on the button.
   */
  export let label = "Unset";
</script>

<div>
  <button
    class:mod-cta={variant === "primary"}
    class:mod-warning={variant === "destructive"}
    class:mod-plain={variant === "plain"}
    aria-label={tooltip}
    on:click
    {disabled}
    class:disabled
  >
    <Icon name={icon} />
    <Typography variant="label" nomargin>
      {label}
    </Typography>
    <slot />
  </button>
</div>

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  button {
    gap: var(--size-4-1);
    width: 75px;
    cursor: pointer;
  }

  .mod-plain {
    background: none;
    box-shadow: none;
    border: none;

    color: var(--text-muted);
  }

  .mod-plain:hover {
    color: var(--text-normal);
  }

  .disabled {
    opacity: 0.6;
    cursor: default;
  }
</style>
