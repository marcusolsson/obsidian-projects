<script lang="ts">
  import Sortable from "sortablejs";
  import { onDestroy, onMount } from "svelte";

  export let onSort: (ids: string[]) => void;

  let ref: HTMLDivElement;
  let sortable: Sortable;

  onMount(() => {
    sortable = Sortable.create(ref, {
      direction: () => "horizontal",
      animation: 100,
      dataIdAttr: "data-id",
      forceFallback: true,
      onSort: () => onSort(sortable.toArray()),
    });
  });

  onDestroy(() => {
    sortable.destroy();
  });
</script>

<!--
	@component

	ViewItemList lays out ViewItems and makes sure the user can scroll them for
	small screens.
-->
<section class="projects-views-select">
  <div class="projects-views-list" bind:this={ref}>
    <slot />
  </div>
</section>

<style>
  .projects-views-list {
    display: flex;
    justify-content: center;
    gap: var(--size-4-1);
    min-width: min-content;
  }

  .projects-views-select {
    overflow-x: auto;
  }

  /* Hide scrollbar but keep functionality. */
  .projects-views-select::-webkit-scrollbar {
    display: none;
  }
</style>
