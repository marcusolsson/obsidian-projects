<script lang="ts">
	export let options: Array<{ label: string; value: string }>;
	export let value: string;
	export let onChange: (value: string) => void;

	function handleClick(val: string): (event: Event) => void {
		return () => {
			value = val;
			onChange(value);
		};
	}
</script>

<div>
	{#each options as option}
		<span
			class:selected={value === option.value}
			on:click={handleClick(option.value)}>{option.label}</span
		>
	{/each}
</div>

<style>
	div {
		display: flex;
		border-radius: var(--border-radius-sm);
		border: 1px solid var(--background-modifier-border);
		padding: var(--spacing-xs);
		background-color: var(--background-primary);
	}

	span {
		cursor: pointer;
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--border-radius-xs);
		/* border-right: 1px solid var(--background-modifier-border); */
	}

	/* span:first-child {
		border-top-left-radius: var(--border-radius-md);
		border-bottom-left-radius: var(--border-radius-md);
	}
	span:last-child {
		border-top-right-radius: var(--border-radius-md);
		border-bottom-right-radius: var(--border-radius-md);
		border-right: 0;
	} */

	.selected {
		background-color: var(--interactive-accent);
		color: var(--text-on-accent);
	}
</style>
