<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import SelectItem from "./SelectItem.svelte";

	/**
	 * Specifies the available options.
	 */
	export let options: Array<{ label: string; value: string }>;

	/**
	 * Specifies the selected value.
	 */
	export let value: string;

	/**
	 * Specifies the placeholder text.
	 */
	export let placeholder: string = "";

	/**
	 * Specifies whether to allow empty values.
	 */
	export let allowEmpty: boolean = false;

	const dispatch = createEventDispatcher<{ change: string }>();

	function handleChange(event: Event) {
		if (event.currentTarget instanceof HTMLSelectElement) {
			dispatch("change", event.currentTarget.value);
		}
	}
</script>

<select
	disabled={!options.length && !!placeholder}
	class="dropdown"
	{value}
	on:change={handleChange}
>
	{#if !options.length && placeholder}
		<SelectItem text={placeholder} value="" disabled />
	{/if}
	{#if allowEmpty}
		<SelectItem text={placeholder} value="" />
	{/if}
	{#each options as option}
		<SelectItem text={option.label} value={option.value} />
	{/each}
</select>
