<script lang="ts">
	export let options: Array<{ label: string; value: string }>;
	export let onChange: (value: string) => void;
	export let value: string;
	export let placeholder: string = "";

	function handleChange(event: Event) {
		if (event.currentTarget instanceof HTMLSelectElement) {
			onChange(event.currentTarget.value);
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
		<option value="" disabled>{placeholder}</option>
	{/if}
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
