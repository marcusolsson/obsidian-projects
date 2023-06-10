<script lang="ts">
  export let variant: "primary" | "error";
  export let tooltip: string = "";
</script>

<span
  aria-label={tooltip}
  class="flair"
  class:mod-pop={variant === "primary"}
  class:error={variant === "error"}
  on:click
  on:keypress><slot /></span
>

<style>
  span {
    color: var(--text-on-accent);
    display: flex;
    align-items: center;
    gap: var(--size-4-1);
  }

  .error {
    background-color: var(--background-modifier-error);
  }
</style>
