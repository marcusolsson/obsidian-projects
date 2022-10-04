<script lang="ts">
	export let colspan: number | null = null;
	export let width: string;
</script>

<td on:dblclick on:mousedown {colspan} style={`width: ${width}`}>
	<slot />
</td>

<style>
	td {
		vertical-align: top;
		box-sizing: border-box;
		padding: 0;
		border: 1px solid var(--background-modifier-border);
		height: calc(100% / 5);
	}

	td:first-of-type {
		border-left: 1px solid var(--background-modifier-border);
	}
	td:last-of-type {
		border-right: 1px solid var(--background-modifier-border);
	}
</style>
