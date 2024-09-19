<script lang="ts">
  import { MarkdownRenderer } from "obsidian";
  import { view } from "src/lib/stores/obsidian";
  import { getContext } from "svelte";
  const sourcePath = getContext<string>("sourcePath") ?? "";

  import { app } from "src/lib/stores/obsidian";
  import { handleHoverLink } from "src/ui/views/helpers";

  export let value: string;
  export let richText: boolean = false;

  function useMarkdown(node: HTMLElement, value: string) {
    MarkdownRenderer.renderMarkdown(value, node, sourcePath, $view);

    return {
      update(newValue: string) {
        node.empty();
        MarkdownRenderer.renderMarkdown(newValue, node, sourcePath, $view);
      },
    };
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

{#if richText}
  <div
    use:useMarkdown={value}
    on:click={handleClick}
    on:mouseover={(event) => {
      handleHoverLink(event, sourcePath);
    }}
    on:focus
    on:keypress
  />
{:else}
  <div>{value}</div>
{/if}

<style>
  div {
    background-color: var(--tag-background);
    border: var(--tag-border-width) solid var(--tag-border-color);
    border-radius: var(--tag-radius);
    color: var(--tag-color);
    font-size: var(--tag-size);
    text-decoration: var(--tag-decoration);
    padding: var(--tag-padding-y) var(--tag-padding-x);
    line-height: 1;

    display: inline-flex;
    align-items: center;
    gap: var(--size-4-1);
  }

  div :global(p:first-child) {
    margin-top: 0;
  }

  div :global(p:last-child) {
    margin-bottom: 0;
  }
</style>
