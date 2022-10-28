<div>
	<slot />
</div>

<style>
	div {
		background-color: var(--background-secondary);
		border-radius: var(--radius-s);
		border: 1px solid var(--background-modifier-border);
		padding: 0;
		margin: 0;
	}

	div:hover {
		border: 1px solid var(--background-modifier-border-hover);
	}
</style>
