<script lang="ts">
	export let nopadding: boolean = false;
</script>

<th scope="col" on:mousedown class:nopadding>
	<div>
		<slot />
	</div>
</th>

<style>
	div {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		gap: 1rem;
	}
	th {
		background: var(--background-secondary);
		border: 1px solid var(--background-modifier-border);
		border-top: 0;
		border-left: 0;

		text-align: center;

		font-weight: 500;
		min-width: 100px;

		vertical-align: top;
		position: sticky !important;
		top: 0;
		z-index: 1;
		padding: 0.3em;
	}

	th:first-child {
		min-width: 5ch;
	}

	.nopadding {
		padding: 0;
	}
</style>
