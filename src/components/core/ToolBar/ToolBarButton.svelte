<script lang="ts">
	export let label: string;
	export let onClick: () => void;
	export let selected: boolean;
</script>

<button on:click={onClick} class:selected>{label}</button>

<style>
	button {
		border-radius: 0;
		margin: 0;
		border: 0;
		background-color: var(--background-secondary);
		font-weight: 500;
	}

	.selected {
		background-color: var(--interactive-accent);
		color: var(--text-on-accent);
	}
</style>
