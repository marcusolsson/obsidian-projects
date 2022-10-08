<script lang="ts">
	import { clickOutside } from "../../../../../app";
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
	export let onCopy: () => void = () => {};
	export let onCut: () => void = () => {};
	export let onPaste: () => void = () => {};

	let hover: boolean = false;

	let ref: HTMLDivElement;

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
	function handleKeyPress(event: KeyboardEvent) {
		if (event.metaKey || event.ctrlKey) {
			switch (event.key) {
				case "c":
					onCopy();
					break;
				case "x":
					onCut();
					break;
				case "v":
					onPaste();
					break;
			}
		}
		switch (event.key) {
			case "Enter":
				if (edit) {
					onEditChange(false);
					ref.focus();
				} else {
					onEditChange(true);
				}
				break;
			case "Escape":
				onEditChange(false);
				ref.focus();
				break;
		}
	}

	function handleBlur(event: FocusEvent) {
		hover = false;

		if (
			event.currentTarget instanceof HTMLDivElement &&
			event.relatedTarget instanceof HTMLElement &&
			event.currentTarget.contains(event.relatedTarget)
		) {
			return;
		}

		onEditChange(false);
		selected = false;
	}
</script>

<div
	bind:this={ref}
	class:columnHeader
	class:header={column.header}
	class:selected
	class:rowHeader
	style={`width: ${column.width}px`}
	tabindex={!columnHeader && !rowHeader ? 1 : undefined}
	on:click={handleClick}
	on:dblclick={handleDoubleClick}
	on:mousedown
	on:mouseenter={() => (hover = true)}
	on:mouseleave={() => (hover = false)}
	on:focus={() => {
		hover = true;
		selected = true;
	}}
	on:blur={handleBlur}
	on:keydown={handleKeyPress}
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
