<script>
  import { createEventDispatcher } from "svelte";
  /**
   * Specifies the link text.
   */
  export let linkText;
  /**
   * Specifies the path to the source file.
   */
  export let sourcePath;
  /**
   * Specifies a tooltip to display when hovering the link.
   */
  export let tooltip = "";
  /**
   * Specifies whether the link is resolved.
   */
  export let resolved;
  const dispatch = createEventDispatcher();
  let aria = {};
  if (tooltip) {
    aria = {
      "aria-label": tooltip,
      "aria-label-position": "top",
    };
  }
</script>

<a
  href={linkText}
  data-href={linkText}
  class={`internal-link`}
  class:is-unresolved={!resolved}
  target="_blank"
  rel="noopener"
  on:click={(event) => {
    event.stopPropagation();

    dispatch("open", {
      linkText,
      sourcePath,
      newLeaf: event.ctrlKey || event.metaKey,
    });
  }}
  {...aria}
>
  <slot />
</a>

<style>
  .is-unresolved {
    opacity: 0.5;
  }
</style>
