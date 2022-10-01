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
	 * Specifies whether to remove decorations so that the input can be embedded
	 * in other components.
	 */
	export let embed: boolean = false;

	/**
	 * Specifies whether to focus the input when it's mounted.
	 */
	export let autofocus: boolean = false;

	/**
	 * Specifies the width of the input.
	 */
	export let width: string = "auto";

	/**
	 * Specifies whether the input contains an error.
	 */
	export let error: boolean = false;

	/**
	 * Specifies additional information for the input.
	 */
	export let helperText: string = "";

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

<div>
	<input
		class:embed
		class:error
		bind:this={ref}
		{value}
		{type}
		{placeholder}
		{readonly}
		on:input={handleInput}
		on:keydown={handleKeyDown}
		style={`width: ${width}`}
	/>
	{#if !!helperText}
		<small class:errorText={error}>
			{helperText}
		</small>
	{/if}
</div>

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

	.error {
		border-color: var(--background-modifier-error);
	}

	.error:hover {
		border-color: var(--background-modifier-error-hover);
	}

	.error:focus {
		box-shadow: 0 0 0 2px var(--background-modifier-error);
		border-color: var(--background-modifier-error);
	}

	small {
		margin-top: var(--size-4-2);
		font-size: var(--font-ui-smaller);
		color: var(--text-muted);
		display: block;
	}
	.errorText {
		color: var(--text-error);
	}
</style>
