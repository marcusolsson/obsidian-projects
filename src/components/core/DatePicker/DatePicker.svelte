<script lang="ts">
	export let value: Date;
	export let onCommit: (value: Date) => void;

	let ref: HTMLInputElement;
	$: {
		if (ref) {
			ref.valueAsDate = value;
		}
	}

	function handleChange(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			onCommit(event.currentTarget.valueAsDate);
		}
	}
</script>

<input bind:this={ref} type="date" on:change={handleChange} />

<style>
	input {
		border-radius: 9999px;
		border: 0;
		background-color: var(--background-secondary-alt);
		font-family: var(--font-default);
		padding: 0.1em 0.6em;
		margin: 0;
		font-size: var(--font-text-size);
		margin: 6px;
	}
</style>
