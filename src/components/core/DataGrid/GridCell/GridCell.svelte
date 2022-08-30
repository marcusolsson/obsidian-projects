<script lang="ts">
	import Resizer from "./Resizer.svelte";

	export let selected: boolean = false;
	export let edit: boolean = false;
	export let width: number = 180;
	export let header: boolean = false;
	export let resizable: boolean = false;
	export let editable: boolean = true;
	export let onResize: (width: number) => void = () => {};

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
		if (!header) {
			selected = true;
		}
	}
	function handleDoubleClick(event: Event) {
		if (!header) {
			edit = true;
		}
	}
</script>

<div
	class:header
	class:selected
	style={`width: ${width}px`}
	on:click={handleClick}
	on:dblclick={handleDoubleClick}
	on:mousedown
	on:mouseenter={() => (hover = true)}
	on:mouseleave={() => (hover = false)}
	use:clickOutside={() => {
		edit = false;
		selected = false;
	}}
>
	{#if $$slots.edit && edit}
		{#if editable}
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
		<Resizer {width} min={80} onChange={onResize} />
	{/if}
</div>

<style>
	div {
		align-items: center;
		width: 180px;
		display: flex;
		border-right: 1px solid var(--background-modifier-border);
		border-left-color: transparent;
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
		z-index: 10000;
		padding: 0;
	}

	.header {
		background-color: var(--background-secondary);
		font-weight: 500;
		text-align: center;
	}
</style>
