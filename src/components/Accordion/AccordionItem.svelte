<script lang="ts">
  import { Icon } from "obsidian-svelte";
  import { slide } from "svelte/transition";

  let open: boolean = false;
</script>

<section class="projects-accordion">
  <header on:click={() => (open = !open)} on:keypress>
    <slot name="header" />
    <Icon name={open ? "chevron-up" : "chevron-down"} />
  </header>

  {#if open}
    <div transition:slide={{ duration: 200 }}>
      <slot />
    </div>
  {/if}
</section>

<style>
  .projects-accordion {
    border-top: 1px solid var(--background-modifier-border);
  }

  .projects-accordion > div {
    padding: 8px;
    background-color: var(--background-secondary);
  }

  .projects-accordion > header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px;
    justify-content: space-between;
  }
</style>
