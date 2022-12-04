<script lang="ts">
  // export let ref: HTMLTableElement;
  export let grow: boolean = false;
</script>

<table class:grow>
  <slot />
</table>

<style>
  table {
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    overflow: auto;
  }

  .grow {
    height: 100%;
    width: 100%;
  }
</style>
