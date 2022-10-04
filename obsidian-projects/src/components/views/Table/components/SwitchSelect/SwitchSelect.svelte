<script lang="ts">
	import { Menu, MenuItem } from "../../../../core/Menu";
	interface SwitchItem {
		label: string;
		value: string;
		enabled: boolean;
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

<Menu
	open={isOpen}
	onClose={() => (isOpen = false)}
	anchorEl={ref}
	params={{
		placement: "bottom-start",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [0, 4],
				},
			},
		],
	}}
>
	{#each items as { label, value, enabled }}
		<MenuItem
			{label}
			{value}
			{enabled}
			onChange={(value, enabled) => onChange(value, enabled)}
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
