<script lang="ts">
	import Icon from "./core/Icon/Icon.svelte";
	import IconButton from "./core/IconButton/IconButton.svelte";

	export let name: string;
	export let selected: boolean = false;
	export let variant: string;
	export let icon: string = "";
	export let onDelete: () => void = () => {};

	let active: boolean = false;
</script>

<div
	class:selected
	on:click
	class:link={variant === "link"}
	on:mouseenter={() => (active = true)}
	on:mouseleave={() => (active = false)}
	on:focus={() => (active = true)}
	on:blur={() => (active = false)}
>
	{#if icon}
		<Icon name={icon} />
	{/if}
	{name}
	{#if active && selected && onDelete}
		<IconButton
			icon="cross"
			on:click={() => {
				onDelete();
			}}
		/>
	{/if}
</div>

<style>
	div {
		margin: 0;

		display: flex;
		align-items: center;
		gap: 8px;

		background: none;
		height: 1.8rem;
		padding: 0 8px;
		font-size: var(--font-ui-small);
		border-radius: var(--radius-s);
	}

	div:hover {
		background-color: var(--background-modifier-hover);
	}

	.selected {
		font-weight: 500;
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
</style>
