<script lang="ts">
  import { Typography } from "src/ui/mocks/obsidian-svelte";

  export let name: string;
</script>

<div>
  <Typography variant="label" nomargin>{name}</Typography>
  <slot />
</div>

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }
</style>
