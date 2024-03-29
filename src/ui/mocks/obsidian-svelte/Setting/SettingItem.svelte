<script>
  export let name = undefined;
  export let description = undefined;
  export let heading = false;
  export let vertical = false;
</script>

<div class="setting-item" class:setting-item-heading={heading} class:vertical>
  <div class="setting-item-info">
    <div class="setting-item-name">{name ?? ""}</div>
    <div class="setting-item-description">{description ?? ""}</div>
  </div>
  <div class="setting-item-control" class:vertical-control={vertical}>
    <slot />
  </div>
</div>

<style>
  .vertical {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--size-4-1);
  }

  .vertical-control {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--size-4-1);
    width: 100%;
  }
</style>
