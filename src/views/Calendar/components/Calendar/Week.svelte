<script lang="ts">
  export let height: number;
</script>

<div style:height={height + "%"}>
  <slot />
</div>

<style>
  div {
    display: flex;
    border-bottom: 1px solid var(--background-modifier-border);
    min-height: 100px;
  }

  div:last-child {
    border-bottom: 0;
  }
</style>
