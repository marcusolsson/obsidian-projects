<script lang="ts">
	export let header: boolean = false;
</script>

<div class:header>
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
