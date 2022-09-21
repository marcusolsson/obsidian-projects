<script lang="ts">
	import { createEventDispatcher } from "svelte";

	/**
	 * Specifies the date value.
	 */
	export let value: Date | null;

	/**
	 * Specifies whether to remove decorations so that it can be embedded in other
	 * components.
	 */
	export let embed: boolean = false;

	let ref: HTMLInputElement;

	$: {
		if (ref && value) {
			// Trick to get the time zones right.
			ref.valueAsDate = new Date(
				value.getFullYear(),
				value.getMonth(),
				value.getDate(),
				12
			);
		}
	}

	const dispatch = createEventDispatcher<{ change: Date }>();

	function handleChange(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			if (event.currentTarget.valueAsDate) {
				dispatch("change", event.currentTarget.valueAsDate);
			}
		}
	}
</script>

<input class:embed bind:this={ref} type="date" on:change={handleChange} />

<style>
	input {
		border-radius: 9999px;
		border: 0;
		background-color: var(--background-modifier-hover);
		font-family: var(--font-default);
		padding: 0.1em 0.6em;
	}

	.embed {
		margin: 0 8px;
	}
</style>
