<script lang="ts">
  import { MarkdownRenderer } from "obsidian";
  import { app, view } from "src/lib/stores/obsidian";
  import { getContext } from "svelte";

  export let value: string;
  export let richText: boolean = false;

  const sourcePath = getContext<string>("sourcePath") ?? "";

  function useMarkdown(node: HTMLElement) {
    MarkdownRenderer.renderMarkdown(value, node, sourcePath, $view);
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

{#if richText}
  <div class="projects-table-cell-text-label" use:useMarkdown on:click={handleClick} on:keypress />
{:else}
  <div class="projects-table-cell-text-label">
    {value}
  </div>
{/if}

<style>
  .projects-table-cell-text-label {
    padding: 6px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .projects-table-cell-text-label :global(p:first-child) {
    margin-top: 0;
  }

  .projects-table-cell-text-label :global(p:last-child) {
    margin-bottom: 0;
  }
</style>
