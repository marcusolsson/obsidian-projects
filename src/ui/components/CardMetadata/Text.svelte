<script lang="ts">
  import { MarkdownRenderer } from "obsidian";
  import type {
    DataField,
    DataValue,
    Optional,
  } from "src/lib/dataframe/dataframe";
  import { app, view } from "src/lib/stores/obsidian";
  import { handleHoverLink } from "src/ui/views/helpers";
  import { getContext } from "svelte";

  export let value: Optional<DataValue>;
  export let field: DataField;

  const sourcePath = getContext<string>("sourcePath") ?? "";

  function useMarkdown(node: HTMLElement) {
    if (typeof value === "string") {
      MarkdownRenderer.render($app, value, node, sourcePath, $view);
    }
  }

  function handleClick(event: MouseEvent) {
    const targetEl = event.target as HTMLElement;
    const closestAnchor =
      targetEl.tagName === "A" ? targetEl : targetEl.closest("a");

    if (!closestAnchor) {
      return;
    }

    event.stopPropagation();

    if (closestAnchor.hasClass("internal-link")) {
      event.preventDefault();

      const href = closestAnchor.getAttr("href");
      const newLeaf = event.button === 1 || event.ctrlKey || event.metaKey;

      if (href) {
        $app.workspace.openLinkText(href, sourcePath, newLeaf);
      }
    }
  }
</script>

{#if field.typeConfig?.richText}
  <div
    use:useMarkdown
    on:click={handleClick}
    on:mouseover={(event) => handleHoverLink(event, sourcePath)}
    on:focus
    on:keypress
  />
{:else if typeof value === "string"}
  <div>
    {value}
  </div>
{/if}

<style>
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4; /* number of lines to show */
    line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  div :global(p:first-child) {
    margin-top: 0;
  }

  div :global(p:last-child) {
    margin-bottom: 0;
  }
</style>
