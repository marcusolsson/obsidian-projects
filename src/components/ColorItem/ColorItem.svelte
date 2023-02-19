<script lang="ts">
  import ColorPill from 'src/components/ColorPill/ColorPill.svelte';
  export let color: string | null;
</script>

<div class="projects-color-item">
  {#if color}
    <ColorPill color={color} />
  {/if}
  <div class="projects-color-item-card-layout">
    <div class="projects-color-item-card-header">
      <slot name="header" />
    </div>
    <slot />
  </div>
</div>

<style>
  .projects-color-item {
    display: flex;
  }

  .projects-color-item-card-layout {
    overflow: hidden;
    flex: 1;
  }

  .projects-color-item-card-header {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .projects-color-item-card-header:last-child {
    margin-bottom: 0;
  }

</style>
