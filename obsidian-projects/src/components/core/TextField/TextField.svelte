<script lang="ts">
	export let value: string;
	export let readonly: boolean;

	let ref: HTMLInputElement;

	export function focus() {
		ref.focus();
	}
</script>

<div
	on:dblclick
	on:mousedown={(ev) => {
		ref.focus();
		ev.preventDefault();
	}}
>
	<input bind:this={ref} bind:value on:keydown on:blur on:focus {readonly} />
</div>

<style>
	input {
		display: block;
		padding: var(--spacing-sm);
		border: 0;
		color: var(--text-normal);
		background: none;
		width: 100%;
		height: 30px;
	}

	input:hover {
		outline: none;
	}

	input[readonly] {
		pointer-events: none;
	}

	input:focus {
		outline: 2px solid var(--interactive-accent);
		outline-offset: 1px;
		background-color: var(--background-primary);
	}
</style>
