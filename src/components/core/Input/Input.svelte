<script lang="ts">
	import { onMount } from "svelte";

	export let type: string = "text";
	export let value: string;
	export let onChange: (value: string) => void;
	export let onSubmit: (value: string) => void = () => {};
	export let readonly: boolean = false;
	export let placeholder: string = "";
	export let embed: boolean;
	export let autofocus: boolean = false;

	let ref: HTMLInputElement;

	function handleInput(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			onChange(event.currentTarget.value);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			onSubmit(value);
		}
	}

	onMount(() => {
		if (autofocus && ref) {
			ref.focus();
			ref.select();
		}
	});
</script>

<input
	bind:this={ref}
	{value}
	{type}
	{placeholder}
	on:input={handleInput}
	{readonly}
	on:keydown={handleKeyDown}
	class:embed
/>

<style>
	.embed {
		border: 0;
		margin: 0;
		padding: 0;
		background: none;
	}

	.embed:focus {
		box-shadow: none;
	}
</style>
