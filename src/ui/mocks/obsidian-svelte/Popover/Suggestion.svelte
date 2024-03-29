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
   * Specifies a function to run when the suggestions closes.
   */
  export let onClose = () => {};
  /**
   * Specifices where to place the menu in relation to the anchor element.
   */
  export let placement = "bottom-start";
</script>

<Popover
  {anchorEl}
  {open}
  {placement}
  className="suggestion-container"
  {onClose}
>
  <div class="suggestion" style="max-height: 300px;">
    <slot />
  </div>
</Popover>
