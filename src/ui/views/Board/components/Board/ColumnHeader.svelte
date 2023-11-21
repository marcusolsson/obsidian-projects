<script lang="ts">
  import { MarkdownRenderer } from "obsidian";
  import { app, view } from "src/lib/stores/obsidian";
  import { getContext } from "svelte";
  import { TextInput, useClickOutside } from "obsidian-svelte";

  export let value: string;
  export let readonly: boolean = false;
  export let richText: boolean = false;

  export let onValidate: (value: string) => boolean;
  export let onRename: (value: string) => void;

  let editing: boolean = false;
  let inputRef: HTMLInputElement;
  $: if (editing && inputRef) {
    inputRef.focus();
    inputRef.select();
  }

  let fallback: string = value;
  function rollback() {
    value = fallback;
  }

  $: error = !onValidate(value);

  const sourcePath = getContext<string>("sourcePath") ?? "";

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

<div
  on:dblclick={() => {
    if (!readonly) editing = true;
  }}
  use:useClickOutside={() => (editing = false)}
>
  {#if editing}
    <TextInput
      noPadding
      embed
      bind:ref={inputRef}
      bind:value
      on:keydown={(event) => {
        if (event.key === "Enter") {
          editing = false;

          if (fallback == value) {
            return;
          }

          if (!error) {
            fallback = value;
            onRename(value);
          } else {
            rollback();
          }
        }
        if (event.key === "Escape") {
          editing = false;
          rollback();
        }
      }}
      on:blur={() => {
        editing = false;
        if (!error) {
          fallback = value;
          onRename(value);
        } else {
          rollback();
        }
      }}
    />
  {:else if richText}
    <span use:useMarkdown={value} on:click={handleClick} on:keypress />
  {:else}
    <span>{value}</span>
  {/if}
</div>

<style>
  span :global(p:first-child) {
    margin-top: 0;
  }

  span :global(p:last-child) {
    margin-bottom: 0;
  }
</style>
