<script lang="ts">
	import IconButton from "./core/IconButton/IconButton.svelte";

	export let name: string;
	export let selected: boolean = false;
	export let variant: string;
	export let onDelete: () => void = () => {};

	let active: boolean = false;
</script>

<button
	class:selected
	on:click
	class:link={variant === "link"}
	on:mouseenter={() => (active = true)}
	on:mouseleave={() => (active = false)}
	on:focus={() => (active = true)}
	on:blur={() => (active = false)}
>
	{name}
	{#if active && selected && onDelete}
		<IconButton
			icon="cross"
			on:click={() => {
				onDelete();
			}}
		/>
	{/if}
</button>

<style>
	button {
		background: var(--background-secondary);
		border-radius: 0;
		margin: 0;
		border-right: 1px solid var(--background-modifier-border);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	button:hover {
		box-shadow: inset 0 -2px 0 0 var(--background-modifier-border);
	}

	button.selected:hover {
		box-shadow: inset 0 -2px 0 0 var(--interactive-accent);
	}

	.selected {
		box-shadow: inset 0 -2px 0 0 var(--interactive-accent);
	}

	.link {
		background: none;
		border: none;
		color: var(--text-muted);
	}

	.link:hover {
		box-shadow: none;
		color: var(--text-normal);
	}
</style>
