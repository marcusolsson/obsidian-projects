<script lang="ts">
  export let value: string;
</script>

<div>
  {value}
</div>

<style>
  div {
    padding: 6px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
