<script lang="ts">
  export let index: number;
  export let header: boolean = false;
</script>

<div class="projects-table-row" role="row" aria-rowindex={index} class:projects-table-header={header} on:mouseover on:focus>
  <slot />
</div>

<style>
  .projects-table-row {
    display: flex;
  }

  .projects-table-header {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>
