<script lang="ts">
  import { createEventDispatcher } from "svelte";
  /**
   * Specifies the link text.
   */
  export let linkText: string;
  /**
   * Specifies the path to the source file.
   */
  export let sourcePath: string;
  /**
   * Specifies a tooltip to display when hovering the link.
   */
  export let tooltip = "";
  /**
   * Specifies whether the link is resolved.
   */
  export let resolved;

  interface openLink {
    linkText: string;
    sourcePath: string;
    newLeaf: boolean;
  }

  interface hoverLink {
    event: MouseEvent;
    linkText: string;
    sourcePath: string;
  }

  const dispatch = createEventDispatcher<{
    open: openLink;
    hover: hoverLink;
  }>();
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
  on:mouseover={(event) => {
    event.stopPropagation();

    dispatch("hover", {
      event,
      linkText,
      sourcePath,
    });
  }}
  on:focus
  {...aria}
>
  <slot />
</a>

<style>
  .is-unresolved {
    opacity: 0.5;
  }
</style>
