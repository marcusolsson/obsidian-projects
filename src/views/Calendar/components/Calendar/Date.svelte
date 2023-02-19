<script lang="ts">
  export let today: boolean = false;
</script>

<span class="projects-calendar-date" class:projects-calendar-date-today={today}><slot /></span>

<style>
  .projects-calendar-date {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 50px;
    width: max-content;
    min-width: 24px;
    text-align: center;
    display: inline-block;
    align-self: center;
  }

  .projects-calendar-date-today {
    background: var(--interactive-accent);
    color: var(--text-on-accent);
  }
</style>
