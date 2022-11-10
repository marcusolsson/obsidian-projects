<script lang="ts">
  import dayjs, { Dayjs } from "dayjs";
  import Sortable from "sortablejs";
  import { onDestroy, onMount } from "svelte";

  export let date: string;
  export let onMoveRecord: (date: Dayjs | null, entryId: string | null) => void;

  let ref: HTMLDivElement;
  let sortable: Sortable;

  onMount(() => {
    sortable = Sortable.create(ref, {
      direction: "vertical",
      dataIdAttr: "data-id",
      group: "calendar-entries",
      forceFallback: true,
      onAdd: (event) => {
        const date = event.to.getAttribute("data-id");
        onMoveRecord(
          date ? dayjs(date) : null,
          event.item.getAttribute("data-id")
        );
      },
    });
  });

  onDestroy(() => {
    sortable.destroy();
  });
</script>

<div bind:this={ref} data-id={date}>
  <slot />
</div>

<style>
  div {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    height: 100%;
    width: 100%;
  }
</style>
