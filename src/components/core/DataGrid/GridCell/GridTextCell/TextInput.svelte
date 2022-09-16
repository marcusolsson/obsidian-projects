<script lang="ts">
	import { onMount } from "svelte/internal";

	export let value: string;
	export let onChange: (value: string) => void;
	export let onBlur: () => void;

	let ref: HTMLInputElement;

	function handleInput(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			value = event.currentTarget.value;
			onChange(value);
		}
	}

	onMount(() => {
		ref.focus();
	});
</script>

<input
	on:keydown={(event) => {
		if (event.key === "Enter") {
			onBlur();
		}
	}}
	type="text"
	bind:this={ref}
	{value}
	on:change={handleInput}
/>

<style>
	input {
		all: unset;
		background-color: var(--background-primary);
		box-sizing: border-box;
		width: 100%;
		padding: 6px;
		font-weight: 400;
		font-family: var(--font-default);
		color: var(--text-normal);
	}

	input:focus {
		box-shadow: none;
	}

	input:hover {
		background-color: transparent;
	}
</style>
