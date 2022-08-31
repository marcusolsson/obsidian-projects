<script lang="ts">
	export let value: string;
	export let onChange: (value: string) => void;

	function handleInput(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			value = event.currentTarget.value;
			onChange(value);
		}
	}
</script>

<input type="text" {value} on:input={handleInput} />

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
		box-shadow: none !important;
	}

	input:hover {
		background-color: transparent;
	}
</style>
