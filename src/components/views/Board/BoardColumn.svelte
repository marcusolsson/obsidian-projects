<script lang="ts">
	import { Typography } from "../../core/Typography";

	export let name: string;
</script>

<div>
	<Typography variant="label" nomargin>{name}</Typography>
	<slot />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		width: 350px;
		border: 1px solid var(--background-modifier-border);
		border-radius: var(--border-radius-md);
		background-color: var(--background-secondary);
	}
</style>
