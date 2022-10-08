<script lang="ts">
	/**
	 * Specifies the color value.
	 */
	export let value: string;
</script>

<input bind:value type="color" on:input on:change />
