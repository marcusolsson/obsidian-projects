<script>
  import Popover from "./Popover.svelte";
  /**
   * Specifies the element to anchor the menu to.
   */
  export let anchorEl;
  /**
   * Specifies whether the menu is open or not.
   */
  export let open;
  /**
   * Specifies a function to run when the menu closes.
   */
  export let onClose = () => {};
  /**
   * Specifices where to place the menu in relation to the anchor element.
   */
  export let placement = "bottom-start";
</script>

<Popover {anchorEl} {open} {placement} className="menu" {onClose}>
  <div class="overflow">
    <slot />
  </div>
</Popover>

<style>
  .overflow {
    max-height: 300px;
    overflow-y: auto;
  }
</style>
