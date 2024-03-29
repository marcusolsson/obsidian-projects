<script>
  import { useIcon } from ".";
  /**
   * Specifies the icon identifier. Visit https://lucide.dev for all valid
   * identifiers.
   */
  export let icon;
  /**
   * Specifies the width and height of the icon in pixels. Defaults to 16px.
   */
  export let size = "md";
  /**
   * Specifies whether icon is active.
   */
  export let active = false;
  /**
   * Specifies the tooltip.
   */
  export let tooltip = "";
  /**
   * Specifies whether to remove the default padding.
   */
  export let nopadding = false;
  /**
   * Specifies whether the button is disabled.
   */
  export let disabled = false;
  /**
   * Specifies a callback for when the button is clicked.
   */
  export let onClick = () => {};
  function handleClick(event) {
    if (!disabled) {
      onClick(event);
    }
  }
</script>

<div
  class="clickable-icon"
  class:nopadding
  class:is-active={active}
  class:icon-xs={size === "xs"}
  class:icon-sm={size === "sm"}
  class:icon-md={size === "md"}
  class:icon-lg={size === "lg"}
  aria-label={tooltip}
  aria-disabled={disabled}
  use:useIcon={icon}
  on:click={handleClick}
/>

<style>
  .nopadding {
    padding: 0;
  }
  .icon-xs {
    --icon-size: var(--icon-xs);
    --icon-stroke: var(--icon-xs-stroke-width);
  }
  .icon-sm {
    --icon-size: var(--icon-s);
    --icon-stroke: var(--icon-s-stroke-width);
  }
  .icon-md {
    --icon-size: var(--icon-m);
    --icon-stroke: var(--icon-m-stroke-width);
  }
  .icon-lg {
    --icon-size: var(--icon-l);
    --icon-stroke: var(--icon-l-stroke-width);
  }
</style>
