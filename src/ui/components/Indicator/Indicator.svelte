<script lang="ts">
  import { Icon } from "obsidian-svelte";

  export let icon: string = ""
  export let content: string | number;
</script>

<div class=task-indicator>
  <Icon name="{icon}" />
  {#if content}
    <span>{content}</span>
  {/if}
</div>

<style>
  div.task-indicator {
    display: flex;
    gap: 4px;
    align-items: center;
  }
</style>