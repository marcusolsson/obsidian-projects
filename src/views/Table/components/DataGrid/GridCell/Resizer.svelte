<script lang="ts">
  export let width: number;
  export let onChange: (width: number) => void;
  export let onFinalize: (width: number) => void;
  export let min: number;

  let start: number | null;
  let initial: number | null;

  function startResize(event: MouseEvent) {
    // Unless we stop propagation, resizing will also drag the column.
    event.stopPropagation();

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

<span class="handle" class:visible={start} on:mousedown={startResize} />

<style>
  .handle {
    position: absolute;
    right: -3px;
    width: 6px;
    min-width: 6px;
    height: 100%;
    border-radius: 1px;
    z-index: 1;
  }
  .handle:hover {
    background-color: var(--interactive-accent);
    cursor: ew-resize;
  }
  .visible {
    background-color: var(--interactive-accent);
    cursor: ew-resize;
  }
</style>
