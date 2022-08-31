<script lang="ts">
	export let header: boolean = false;
</script>

<div class:header>
	<slot />
</div>

<style>
	div {
		display: flex;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	div:last-child {
		border-bottom-color: transparent;
	}

	.header {
		position: sticky;
		top: 0;
		z-index: 20000;
	}
</style>
