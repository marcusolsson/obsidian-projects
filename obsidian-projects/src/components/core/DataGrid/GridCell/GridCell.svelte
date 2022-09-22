<script lang="ts">
	import type { GridColDef } from "../data-grid";

	import Resizer from "./Resizer.svelte";

	export let selected: boolean = false;
	export let edit: boolean = false;
	export let resizable: boolean = false;
	export let onResize: (width: number) => void = () => {};
	export let onFinalizeResize: (width: number) => void = () => {};
	export let column: GridColDef;
	export let columnHeader: boolean = false;
	export let rowHeader: boolean = false;
	export let onEditChange: (value: boolean) => void = (value: boolean) => {
		edit = value;
	};

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
			onEditChange(true);
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
	on:mouseenter={() => (hover = true)}
	on:mouseleave={() => (hover = false)}
	on:focus={() => (hover = true)}
	on:blur={() => (hover = false)}
	use:clickOutside={() => {
		onEditChange(false);
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
		<Resizer
			width={column.width ?? 180}
			min={100}
			onChange={onResize}
			onFinalize={onFinalizeResize}
		/>
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		background-color: var(--background-primary);
		border-right: 1px solid var(--background-modifier-border);
		border-left-color: var(--background-modifier-border);
		border-bottom: 1px solid var(--background-modifier-border);

		box-sizing: border-box;
		vertical-align: middle;
		width: 100%;
		min-height: 30px;
	}

	.selected {
		box-shadow: 0 0 0 3px var(--interactive-accent);
		z-index: 9;
		padding: 0;
	}

	.columnHeader {
		background-color: var(--background-secondary);
		font-weight: 500;
		text-align: center;
		justify-content: space-between;
		padding: 0 4px;
	}

	.header {
		background-color: var(--background-secondary);
		position: sticky;
		left: 60px;
		/* z-index: 10; */
	}

	.rowHeader {
		left: 0px;
		justify-content: center;
	}
</style>
