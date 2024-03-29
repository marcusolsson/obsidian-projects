<script>
  import { createPopper } from "@popperjs/core";
  import Portal from "src/ui/mocks/svelte-portal/Portal.svelte";
  import { onDestroy } from "svelte";
  import { useClickOutside } from "./useClickOutside";
  /**
   * Specifies the element to anchor the menu to.
   */
  export let anchorEl;
  /**
   * Specifies whether the menu is open or not.
   */
  export let open;
  /**
   * Specifies whether the class name to use for the popover element.
   */
  export let className = "popover layer";
  /**
   * Specifies a function to run when the popover closes.
   */
  export let onClose = () => {};
  /**
   * Specifices where to place the menu in relation to the anchor element.
   */
  export let placement = "bottom-start";
  let popperEl;
  let popper = null;
  const params = {
    placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 4],
        },
      },
    ],
  };
  $: {
    if (anchorEl && popperEl) {
      popper = createPopper(anchorEl, popperEl, params);
    }
  }
  $: if (!open) {
    onClose();
  }
  onDestroy(() => {
    if (popper) {
      popper.destroy();
    }
  });
</script>

{#if open}
  <Portal target={anchorEl.doc.body}>
    <div
      class={className}
      bind:this={popperEl}
      use:useClickOutside={{
        open,
        anchorEl,
        onClickOutside: () => {
          open = false;
        },
      }}
    >
      <slot />
    </div>
  </Portal>
{/if}

<style>
  .layer {
    z-index: var(--layer-popover);
  }
</style>
