<script lang="ts">
	export let index: number;
	export let header: boolean = false;
</script>

<div role="row" aria-rowindex={index} class:header on:mouseover on:focus>
	<slot />
</div>

<style>
	div {
		display: flex;
	}

	.header {
		position: sticky;
		top: 0;
	}
</style>
