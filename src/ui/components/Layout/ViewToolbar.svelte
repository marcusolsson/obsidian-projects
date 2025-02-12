<script lang="ts">
  export let variant: "primary" | "secondary";
  let clientWidth: number;

  $: isMobile = clientWidth < 480;
</script>

<div
  class="container"
  class:primary={variant === "primary"}
  class:secondary={variant === "secondary"}
  class:isMobile
  bind:clientWidth
>
  <div class="left">
    <slot name="left" />
  </div>
  <slot name="info" />
  <div class="middle">
    <slot name="middle" />
  </div>
  <div class="right">
    <slot name="right" />
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
    padding: var(--size-4-2);
    gap: var(--size-4-2);
    border-bottom: 1px solid var(--background-modifier-border);
    align-items: center;
    width: auto;
  }
  .middle {
    flex: 1;
    overflow-x: auto;
    text-align: center;
    min-width: 200px;
  }
  .right {
    display: flex;
    align-items: center;
    gap: var(--size-4-2);
    flex-wrap: wrap;
  }
  .isMobile {
    flex-direction: column;
    align-items: stretch;
  }
  .isMobile .right {
    align-items: stretch;
  }

  .primary {
    background-color: var(--background-primary);
  }
  .secondary {
    background-color: var(--background-primary-alt);
  }
</style>
