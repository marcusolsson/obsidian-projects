<script>
  import Week from "./Week.svelte";
</script>

<div class="projects-calendar-view">
  <slot />
</div>

<style>
  .projects-calendar-view {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
