<script lang="ts">
	import { Icon, IconButton } from "obsidian-svelte";

	export let name: string;
	export let selected: boolean = false;
	export let variant: string;
	export let icon: string = "";
	export let onRename: (value: string) => void = () => {};
	export let onDelete: () => void = () => {};
	export let onValidate: (name: string) => boolean;

	let active: boolean = false;
	let editing: boolean = false;

	let fallback: string = name;

	$: error = !onValidate(name);

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
</script>

<div
	class:selected
	on:click
	class:error
	class:link={variant === "link"}
	on:mouseenter={() => (active = true)}
	on:mouseleave={() => (active = false)}
	on:focus={() => (active = true)}
	on:blur={() => {
		active = false;
		editing = false;

		name = fallback;
	}}
	on:dblclick={() => (editing = true)}
	use:clickOutside={() => {
		editing = false;

		name = fallback;
	}}
>
	{#if icon}
		<Icon name={icon} size={18} />
	{/if}
	{#if editing}
		<input
			bind:value={name}
			style={`width: ${name.length}ch`}
			on:keydown={(event) => {
				if (event.key === "Enter") {
					editing = false;

					if (!error) {
						fallback = name;
						onRename(name);
					} else {
						name = fallback;
					}
				}
			}}
		/>
	{:else}
		{name}
	{/if}
	{#if active && selected && onDelete}
		<IconButton
			icon="cross"
			nopadding
			on:click={() => {
				onDelete();
			}}
		/>
	{/if}
</div>

<style>
	div {
		margin: 0;

		display: inline-flex;
		align-items: center;
		gap: 4px;

		background: none;
		height: 1.8rem;
		padding: 0 8px;
		min-width: min-content;
		font-size: var(--font-ui-small);
		border-radius: var(--radius-s);

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		border: 1px solid transparent;
	}

	div:hover {
		background-color: var(--background-modifier-hover);
	}

	.selected {
		background-color: var(--background-modifier-hover);
	}

	.link {
		background: none;
		border: none;
		color: var(--text-faint);
	}

	.link:hover {
		background: none;
		color: var(--text-muted);
		box-shadow: none;
	}

	.error {
		border: 1px solid var(--background-modifier-error);
	}
	.error:hover {
		border: 1px solid var(--background-modifier-error-hover);
	}
</style>
