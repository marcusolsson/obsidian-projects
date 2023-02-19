<div class="projects-gallery-card">
  <slot />
</div>

<style>
  .projects-gallery-card {
    background-color: var(--background-secondary);
    border-radius: var(--radius-s);
    border: 1px solid var(--background-modifier-border);
    padding: 0;
    margin: 0;
  }

  .projects-gallery-card:hover {
    border: 1px solid var(--background-modifier-border-hover);
  }
</style>
