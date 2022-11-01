<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Sortable from "sortablejs";

  export let onSort: (ids: string[]) => void;

  let ref: HTMLDivElement;
  let sortable: Sortable;

  onMount(() => {
    sortable = Sortable.create(ref, {
      direction: () => "horizontal",
      animation: 100,
      dataIdAttr: "data-id",
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
<section>
  <div bind:this={ref}>
    <slot />
  </div>
</section>

<style>
  div {
    display: flex;
    justify-content: center;
    gap: var(--size-4-1);
    min-width: min-content;
  }

  section {
    flex: 1;
    overflow-x: auto;
  }

  /* Hide scrollbar but keep functionality. */
  section::-webkit-scrollbar {
    display: none;
  }
</style>
