<script lang="ts">
  export let index: number;
  export let header: boolean = false;
  export let footer: boolean = false;
</script>

<div role="row" aria-rowindex={index} class:header class:footer>
  <slot />
</div>

<style>
  div {
    display: flex;
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .footer {
    position: sticky;
    bottom: 0;
    z-index: 10;

    background-color: var(--background-primary-alt);
    border-bottom: 1px solid var(--background-modifier-border);
  }
</style>
