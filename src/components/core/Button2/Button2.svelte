<script lang="ts">
	import { Icon } from "../Icon";
	export let icon: string = "";
</script>

<button on:click>
	{#if icon}
		<Icon name={icon} />
	{/if}
	<slot />
</button>

<style>
	button {
		border-radius: 0;
		width: 100%;
		display: flex;
		gap: var(--spacing-sm);
		background-color: transparent;
		align-items: stretch;
		justify-content: center;
		height: 30px;
		margin: 0;
		border: 0;
	}

	button:hover {
		background-color: var(--background-secondary);
	}
</style>
