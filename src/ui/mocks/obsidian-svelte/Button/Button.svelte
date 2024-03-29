<script>
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
   * Specifies the reference for the underlying button element.
   */
  export let ref = null;
</script>

<button
  bind:this={ref}
  class:mod-cta={variant === "primary"}
  class:mod-warning={variant === "destructive"}
  class:mod-plain={variant === "plain"}
  aria-label={tooltip}
  on:click
  {disabled}
  class:disabled
>
  <slot />
</button>

<style>
  button {
    /* Add a gap between text and icons. */
    gap: var(--size-4-1);
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
  }
</style>
