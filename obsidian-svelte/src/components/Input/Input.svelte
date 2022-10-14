<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

	/**
	 * Specifies the type of input.
	 */
	export let type: "text" | "number";

	/**
	 * Specifies the input value.
	 */
	export let value: any;

	/**
	 * Specifies the reference for the underlying input element.
	 */
	export let ref: HTMLInputElement | null = null;

	/**
	 * Specifies whether the input is readonly.
	 */
	export let readonly: boolean = false;

	/**
	 * Specifies the placeholder text.
	 */
	export let placeholder: string = "";

	/**
	 * Specifies whether to focus the input when it's mounted.
	 */
	export let autoFocus: boolean = false;

	/**
	 * Specifies the width of the input.
	 */
	export let width: string = "auto";

	/**
	 * Specifies whether the input contains an error.
	 */
	export let error: boolean = false;

	/**
	 * Specifies whether to remove styles to embed the input in another
	 * component.
	 */
	export let embed: boolean = false;

	/**
	 * Specifies an message for the input.
	 */
	export let helperText: string = "";

	const dispatch = createEventDispatcher<{ input: string | number | null }>();

	$: dispatch("input", value);

	onMount(() => {
		if (autoFocus && ref) {
			ref.focus();
		}
	});
</script>

<div style={`width: ${width}`}>
	<input
		class:error
		class:embed
		bind:this={ref}
		{value}
		{type}
		{placeholder}
		{readonly}
		on:input
		on:focus
		on:blur
		on:keydown
		on:keyup
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
		all: unset;
		background-color: var(--background-primary);
		box-sizing: border-box;
		padding: 6px;
		font-weight: 400;
		font-family: var(--font-default);
		color: var(--text-normal);
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
		margin-top: var(--size-4-1);
		font-size: var(--font-ui-smaller);
		color: var(--text-muted);
		display: block;
	}
	.errorText {
		color: var(--text-error);
	}
</style>
