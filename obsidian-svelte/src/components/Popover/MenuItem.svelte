<script lang="ts">
	import { Switch, useIcon } from "obsidian-svelte";

	import { createEventDispatcher } from "svelte";

	/**
	 * Specifies the text label.
	 */
	export let label: string;

	let selected: boolean = false;

	/**
	 * Specifies the icon.
	 */
	export let icon: string = "";

	/**
	 * Specifies whether the menu item is checked.
	 */
	export let checked: boolean | undefined = undefined;

	const dispatch = createEventDispatcher<{ check: boolean }>();

	$: dispatch("check", checked);
</script>

<div
	class="menu-item"
	class:selected
	on:mouseenter={() => (selected = true)}
	on:mouseleave={() => (selected = false)}
	on:click
>
	{#if checked !== undefined}
		<Switch
			{checked}
			on:check={({ detail: enabled }) => (checked = enabled)}
		/>
	{/if}
	{#if icon}
		<div class="menu-item-icon" use:useIcon={icon} />
	{/if}
	<div class="menu-item-title">{label}</div>
</div>
