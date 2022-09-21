<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

	/**
	 * Specifies the type of input.
	 */
	export let type: string = "text";

	/**
	 * Specifies the input value.
	 */
	export let value: string;

	/**
	 * Specifies whether the input is readonly.
	 */
	export let readonly: boolean = false;

	/**
	 * Specifies the placeholder text.
	 */
	export let placeholder: string = "";

	/**
	 * Specifices whether to remove decorations so that the input can be embedded
	 * in other components.
	 */
	export let embed: boolean = false;

	/**
	 * Specifices whether to focus the input when it's mounted.
	 */
	export let autofocus: boolean = false;

	let ref: HTMLInputElement;

	const dispatch = createEventDispatcher<{ input: string; submit: string }>();

	function handleInput(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			dispatch("input", event.currentTarget.value);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			dispatch("submit", value);
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
	class:embed
	bind:this={ref}
	{value}
	{type}
	{placeholder}
	{readonly}
	on:input={handleInput}
	on:keydown={handleKeyDown}
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
