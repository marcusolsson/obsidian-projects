<script lang="ts">
  import { MarkdownRenderer, Menu } from "obsidian";
  import { app, view } from "src/lib/stores/obsidian";
  import { getContext } from "svelte";
  import { IconButton } from "obsidian-svelte";
  export let value: string;
  export let richText: boolean = false;

  export let onColumnMenu: () => Menu;
  const sourcePath = getContext<string>("sourcePath") ?? "";

  function useMarkdown(node: HTMLElement, value: string) {
    MarkdownRenderer.render($app, value, node, sourcePath, $view);

    return {
      update(newValue: string) {
        node.empty();
        MarkdownRenderer.render($app, newValue, node, sourcePath, $view);
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

<div>
  {#if richText}
    <span use:useMarkdown={value} on:click={handleClick} on:keypress />
  {:else}
    <span>
      {value}
    </span>
  {/if}
  <IconButton
    icon="more-vertical"
    size="sm"
    onClick={(event) => {
      onColumnMenu().showAtMouseEvent(event);
    }}
  />
</div>

<style>
  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span :global(p:first-child) {
    margin-top: 0;
  }

  span :global(p:last-child) {
    margin-bottom: 0;
  }

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
