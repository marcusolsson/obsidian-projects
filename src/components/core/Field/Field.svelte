<script lang="ts">
	import { Typography } from "../Typography";

	export let name: string;
</script>

<div>
	<Typography variant="label" nomargin>{name}</Typography>
	<slot />
</div>

<style>
	div {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--spacing-md);
		width: 100%;
	}
</style>
