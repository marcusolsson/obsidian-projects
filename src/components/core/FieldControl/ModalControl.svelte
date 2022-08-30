<script lang="ts">
	export let editing: boolean;
</script>

<div>
	{#if editing}
		<slot name="edit" />
	{:else}
		<slot name="read" />
	{/if}
</div>
