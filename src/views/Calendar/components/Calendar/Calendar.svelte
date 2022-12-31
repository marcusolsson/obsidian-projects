<script>
  import Week from "./Week.svelte";
</script>

<div>
  <slot />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
