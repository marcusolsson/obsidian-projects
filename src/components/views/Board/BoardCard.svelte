<div on:click>
	<slot />
</div>

<style>
	div {
		background-color: var(--background-primary);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--spacing-md);
		border: 1px solid transparent;
	}

	div:hover {
		border: 1px solid var(--background-modifier-border);
		cursor: pointer;
	}
</style>
