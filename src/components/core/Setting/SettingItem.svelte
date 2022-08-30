<script lang="ts">
	export let name: string;
	export let description: string = "";
</script>

<div class="setting-item">
	<div class="setting-item-info">
		<div class="setting-item-name">{name}</div>
		<div class="setting-item-name">{description}</div>
	</div>
	<div class="setting-item-control">
		<slot />
	</div>
</div>
