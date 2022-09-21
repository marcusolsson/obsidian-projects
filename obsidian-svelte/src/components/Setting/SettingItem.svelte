<script lang="ts">
	export let name: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let vertical: boolean = false;
</script>

<div class="setting-item" class:vertical>
	<div class="setting-item-info">
		<div class="setting-item-name">{name ?? ""}</div>
		<div class="setting-item-description">{description ?? ""}</div>
	</div>
	<div class="setting-item-control" class:vertical-control={vertical}>
		<slot />
	</div>
</div>

<style>
	.vertical {
		flex-direction: column;
		align-items: flex-start;
		gap: var(--size-4-1);
	}

	.vertical-control {
		flex-direction: column;
		align-items: flex-start;
		gap: var(--size-4-1);
		width: 100%;
	}
</style>
