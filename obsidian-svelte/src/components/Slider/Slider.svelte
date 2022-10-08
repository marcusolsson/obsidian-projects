<script lang="ts">
	/**
	 * Specifies the value;
	 */
	export let value: number;

	/**
	 * Specifies the minimum allowed value.
	 */
	export let min: number;

	/**
	 * Specifies the maximum allowed value.
	 */
	export let max: number;

	/**
	 * Specifies the step size.
	 */
	export let step: number;
</script>

<input
	bind:value
	type="range"
	class="slider"
	{min}
	{max}
	{step}
	on:change
	on:input
/>
