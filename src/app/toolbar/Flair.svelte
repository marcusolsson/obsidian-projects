<script lang="ts">
  export let variant: "primary" | "error";
</script>

<span
  class="projects-flair"
  class:mod-pop={variant === "primary"}
  class:error={variant === "error"}
  on:click
  on:keypress><slot /></span
>

<style>
  .projects-flair {
    color: var(--text-on-accent);
  }

  .error {
    background-color: var(--background-modifier-error);
  }
</style>
