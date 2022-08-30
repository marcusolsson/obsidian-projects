<th scope="row" on:mousedown><slot /></th>

<style>
	th {
		padding: 0;
		background: var(--background-secondary);
		border-bottom: 1px solid var(--background-modifier-border);

		font-size: 0.8rem;
		text-align: center;

		font-weight: 400;
		min-width: 100px;

		vertical-align: middle;
		position: sticky;
		left: 0;
	}

	th:first-child {
		min-width: 5ch;
	}
</style>
