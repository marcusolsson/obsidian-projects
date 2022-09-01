<script lang="ts">
	export let fullWidth: boolean = false;
	export let alignItems: string = "center";
</script>

<div class:fullWidth style="align-items: ${alignItems}">
	<slot />
</div>

<style>
	div {
		display: flex;
		gap: 8px;
	}

	.fullWidth {
		width: 100%;
		justify-content: space-between;
	}
</style>
