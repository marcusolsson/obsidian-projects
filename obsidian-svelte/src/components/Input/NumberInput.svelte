<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Input from "./Input.svelte";

	/**
	 * Specifies the input value.
	 */
	export let value: number | null;

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
	 * Specifies an helper message for the input.
	 */
	export let helperText: string = "";

	const dispatch = createEventDispatcher<{ input: number | null }>();

	$: dispatch("input", value);

	function handleInput(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			value = event.currentTarget.valueAsNumber;
		}
	}
</script>

<Input
	type="number"
	bind:ref
	bind:value
	{readonly}
	{placeholder}
	{autoFocus}
	{width}
	{embed}
	{error}
	{helperText}
	on:input={handleInput}
	on:focus
	on:blur
	on:keydown
/>
