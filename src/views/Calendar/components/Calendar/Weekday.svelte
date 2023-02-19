<script lang="ts">
  export let weekend: boolean = false;
  export let width: number;
</script>

<div class="projects-calendar-weekday" class:projects-calendar-weekday-weekend={weekend} style:width={width + "%"}>
  <slot />
</div>

<style>
  .projects-calendar-weekday {
    width: calc(100% / 7);
    border-right: 1px solid var(--background-modifier-border);
    padding: 4px;
    padding-bottom: 0;
    text-align: center;
    font-size: var(--font-ui-small);
    font-weight: 500;
    color: var(--text-muted);
  }

  .projects-calendar-weekday-weekend {
    background-color: var(--background-secondary);
  }
</style>
