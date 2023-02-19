<script lang="ts">
  export let height: number;
</script>

<div class="projects-calendar-week" style:height={height + "%"}>
  <slot />
</div>

<style>
  .projects-calendar-week {
    display: flex;
    border-bottom: 1px solid var(--background-modifier-border);
    min-height: 100px;
  }

  .projects-calendar-week:last-child {
    border-bottom: 0;
  }
</style>
