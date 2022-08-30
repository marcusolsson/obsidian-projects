<script lang="ts">
	export let options: Array<{ label: string; value: string }>;
	export let onChange: (value: string) => void;
	export let value: string;

	function handleChange(event: Event) {
		if (event.currentTarget instanceof HTMLSelectElement) {
			onChange(event.currentTarget.value);
		}
	}
</script>

<select class="dropdown" {value} on:change={handleChange}>
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
