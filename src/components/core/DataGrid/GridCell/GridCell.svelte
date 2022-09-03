<script lang="ts">
	import type { GridColDef } from "../data-grid";

	import Resizer from "./Resizer.svelte";

	export let selected: boolean = false;
	export let edit: boolean = false;
	export let resizable: boolean = false;
	export let onResize: (width: number) => void = () => {};
	export let column: GridColDef;
	export let columnHeader: boolean = false;
	export let rowHeader: boolean = false;

	let hover: boolean = false;

	function clickOutside(element: HTMLElement, callbackFunction: () => void) {
		function onClick(event: any) {
			if (!element.contains(event.target)) {
				callbackFunction();
			}
		}

		document.body.addEventListener("click", onClick);

		return {
			update(newCallbackFunction: () => void) {
				callbackFunction = newCallbackFunction;
			},
			destroy() {
				document.body.removeEventListener("click", onClick);
			},
		};
	}

	function handleClick(event: Event) {
		if (!column.header && !columnHeader && !rowHeader) {
			selected = true;
		}
	}
	function handleDoubleClick(event: Event) {
		if (!column.header && !columnHeader && !rowHeader) {
			edit = true;
		}
	}
</script>

<div
	class:columnHeader
	class:header={column.header}
	class:selected
	class:rowHeader
	style={`width: ${column.width}px`}
	on:click={handleClick}
	on:dblclick={handleDoubleClick}
	on:mousedown
	on:mouseover={() => (hover = true)}
	on:mouseout={() => (hover = false)}
	on:focus={() => (hover = true)}
	on:blur={() => (hover = false)}
	use:clickOutside={() => {
		edit = false;
		selected = false;
	}}
>
	{#if $$slots.edit && edit}
		{#if column.editable}
			<slot name="edit" />
		{:else}
			<slot name="read" />
		{/if}
	{:else if $$slots.selected && selected}
		<slot name="selected" />
	{:else if $$slots.hover && hover}
		<slot name="hover" />
	{:else}
		<slot name="read" />
	{/if}

	{#if resizable}
		<Resizer width={column.width ?? 180} min={80} onChange={onResize} />
	{/if}
</div>

<style>
	div {
		align-items: center;
		width: 180px;
		display: flex;
		border-right: 1px solid var(--background-modifier-border);
		border-left-color: var(--background-modifier-border);
		border-bottom: 1px solid var(--background-modifier-border);
		box-sizing: border-box;
		justify-content: center;
		background-color: var(--background-primary);
		vertical-align: middle;
	}

	div:first-child {
		/* flex: 1; */
	}

	div:last-child {
		border-right-color: transparent;
	}

	.selected {
		box-shadow: 0 0 0 3px var(--interactive-accent);
		z-index: 9999;
		padding: 0;
	}

	.columnHeader {
		background-color: var(--background-secondary);
		font-weight: 500;
		text-align: center;
	}

	.header {
		background-color: var(--background-secondary);
		position: sticky;
		left: 60px;
		z-index: 10000;
	}

	.rowHeader {
		left: 0px;
	}
</style>
