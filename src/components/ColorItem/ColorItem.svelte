<script lang="ts">
  export let color: string | null;
</script>

<div class="color-item">
  {#if color}
    <span
      style="margin-right: 8px; background-color: {color}; min-width: 5px; border-radius: 9999px;"
    />
  {/if}
  <div class="card-layout">
    <div class="card-header">
      <slot name="header" />
    </div>
    <slot />
  </div>
</div>

<style>
  .color-item {
    display: flex;
  }
  .card-layout {
    overflow: hidden;
    flex: 1;
  }
  .card-header {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .card-header:last-child {
    margin-bottom: 0;
  }
</style>
