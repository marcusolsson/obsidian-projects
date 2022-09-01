<script lang="ts">
	export let name: string;
</script>

<div on:click>{name}</div>

<style>
	div {
		border-radius: 4px;
		border: 1px solid var(--background-modifier-border);
		background-color: var(--background-secondary);
		padding: 0.2em 0.4em;
		font-size: var(--font-ui-small);
		width: 100%;
	}

	div:hover {
		background-color: var(--background-modifier-hover);
	}
</style>
