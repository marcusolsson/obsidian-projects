<div on:click>
	<slot />
</div>

<style>
	div {
		background-color: var(--background-primary);
		border-radius: var(--radius-s);
		border: 1px solid var(--background-modifier-border);
		padding: var(--size-4-2);
	}

	div:hover {
		border: 1px solid var(--background-modifier-border-hover);
	}
</style>
