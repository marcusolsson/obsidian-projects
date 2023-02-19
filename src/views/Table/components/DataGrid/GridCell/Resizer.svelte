<script lang="ts">
  export let width: number;
  export let onChange: (width: number) => void;
  export let onFinalize: (width: number) => void;
  export let min: number;

  let start: number | null;
  let initial: number | null;

  function startResize(event: MouseEvent) {
    start = event.pageX;
    initial = width;
  }

  function stopResize(event: MouseEvent) {
    if (start && initial) {
      const delta = event.pageX - start;
      const newWidth = initial + delta;

      if (newWidth >= min) {
        onFinalize(width);
      }
    }

    start = null;
    initial = null;
  }

  function resize(event: MouseEvent) {
    if (start && initial) {
      const delta = event.pageX - start;
      const newWidth = initial + delta;

      if (newWidth >= min) {
        onChange(newWidth);
      }
    }
  }
</script>

<svelte:window on:mouseup={stopResize} on:mousemove={resize} />

{#if start}
  <span class="projects-table-handle projects-table-handle-visible" on:mousedown={startResize} />
{:else}
  <span class="projects-table-handle" on:mousedown={startResize} />
{/if}

<style>
  .projects-table-handle {
    position: relative;
    left: 7.5px;
    width: 6px;
    min-width: 6px;
    height: 100%;
    border-radius: 1px;
  }
  .projects-table-handle:hover {
    background-color: var(--interactive-accent);
    cursor: ew-resize;
  }
  .projects-table-handle-visible {
    background-color: var(--interactive-accent);
    cursor: ew-resize;
  }
</style>
