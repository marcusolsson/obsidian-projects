<script lang="ts">
  export let value: number;
</script>

<div>
  {new Intl.NumberFormat().format(value)}
</div>

<style>
  div {
    width: 100%;
    padding: 6px;
    text-align: right;
  }
</style>
