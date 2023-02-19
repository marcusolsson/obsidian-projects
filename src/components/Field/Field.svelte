<script lang="ts">
  import { Typography } from "obsidian-svelte";

  export let name: string;
</script>

<div class="projects-field">
  <Typography variant="label" nomargin>{name}</Typography>
  <slot />
</div>

<style>
  .projects-field {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }
</style>
