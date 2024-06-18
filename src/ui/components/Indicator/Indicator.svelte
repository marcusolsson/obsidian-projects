<script lang="ts">
  import { Icon } from "obsidian-svelte";
  export let icon: string = "";
</script>

<div class="task-indicator">
  <Icon name={icon} size="sm" />
  <slot />
</div>

<style>
  div.task-indicator {
    display: flex;
    gap: 4px;
    align-items: center;
  }
</style>
