<script lang="ts">
	export let value: Date | null;
	export let onCommit: (value: Date) => void;

	let ref: HTMLInputElement;
	$: {
		if (ref && value) {
			ref.valueAsDate = new Date(
				value.getFullYear(),
				value.getMonth(),
				value.getDate(),
				12
			);
		}
	}

	function handleChange(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			if (event.currentTarget.valueAsDate) {
				onCommit(event.currentTarget.valueAsDate);
			}
		}
	}
</script>

<input bind:this={ref} type="date" on:change={handleChange} />

<style>
	input {
		border-radius: 9999px;
		border: 0;
		background-color: var(--background-modifier-hover);
		font-family: var(--font-default);
		padding: 0.1em 0.6em;
		margin: 0;
		font-size: var(--font-ui-small);
		margin: 0 8px;
		width: 100%;
	}
</style>
