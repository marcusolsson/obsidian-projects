<script lang="ts">
	import { Menu, MenuItem } from "obsidian-svelte";
	interface SwitchItem {
		readonly label: string;
		readonly value: string;
		readonly enabled: boolean;
	}

	export let items: SwitchItem[];
	export let label: string;
	export let onChange: (value: string, enabled: boolean) => void;

	let ref: HTMLDivElement;

	let isOpen: boolean = false;
</script>

<div bind:this={ref} class="dropdown" on:click={() => (isOpen = true)}>
	{label}
</div>

<Menu anchorEl={ref} open={isOpen} onClose={() => (isOpen = false)}>
	{#each items as { label, value, enabled }}
		<MenuItem
			{label}
			checked={enabled}
			on:check={({ detail: checked }) => onChange(value, checked)}
		/>
	{/each}
</Menu>

<style>
	div {
		align-items: center;
		display: inline-flex;
		text-align: start;
	}
</style>
