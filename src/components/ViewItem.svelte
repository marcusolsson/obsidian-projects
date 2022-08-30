<script lang="ts">
	import IconButton from "./core/IconButton/IconButton.svelte";

	export let name: string;
	export let selected: boolean = false;
	export let variant: string;
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
	{name}
	{#if active && selected && onDelete}
		<IconButton
			icon="cross"
			iconSize={13}
			on:click={() => {
				onDelete();
			}}
		/>
	{/if}
</div>

<style>
	div {
		background: none;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 16px;
		font-size: var(--font-ui-small);
	}

	div:hover {
		box-shadow: inset 0 -2px 0 0 var(--interactive-accent);
	}

	.selected {
		box-shadow: inset 0 -2px 0 0 var(--interactive-accent);
		color: var(--text-accent);
		font-weight: 500;
	}

	.link {
		background: none;
		border: none;
		color: var(--text-muted);
	}

	.link:hover {
		background: none;
		color: var(--text-normal);
		box-shadow: none;
	}
</style>
