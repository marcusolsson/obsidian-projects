<script lang="ts">
  export let value: number;
</script>

<div class="projects-table-cell-number-label">
  {new Intl.NumberFormat().format(value)}
</div>

<style>
  .projects-table-cell-number-label {
    width: 100%;
    padding: 6px;
    text-align: right;
  }
</style>
