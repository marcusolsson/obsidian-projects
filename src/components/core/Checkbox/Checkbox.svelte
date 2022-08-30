<script lang="ts">
	export let value: boolean;
	export let onChange: (value: boolean) => void;

	let ref: HTMLDivElement;

	function handleClick(event: Event) {
		value = !value;
		onChange(value);
	}

	$: {
		if (ref) {
			if (value) {
				ref.classList.add("is-enabled");
			} else {
				ref.classList.remove("is-enabled");
			}
		}
	}
</script>

<div bind:this={ref} class="checkbox-container" on:click={handleClick}>
	<input type="checkbox" />
</div>

<style>
</style>
