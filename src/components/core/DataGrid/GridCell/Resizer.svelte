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
	<span class="handle visible" on:mousedown={startResize} />
{:else}
	<span class="handle" on:mousedown={startResize} />
{/if}

<style>
	.handle {
		box-sizing: border-box;
		position: relative;
		left: 3px;
		width: 6px !important;
		height: 100%;
		border-radius: 2px;
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
