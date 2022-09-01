<script lang="ts">
	type ButtonVariant = "default" | "destructive" | "primary" | "plain";

	export let variant: ButtonVariant = "default";
</script>

<button
	class:mod-cta={variant === "primary"}
	class:mod-warning={variant === "destructive"}
	class:mod-plain={variant === "plain"}
	on:click
>
	<slot />
</button>

<style>
	.mod-plain {
		background: unset;
		box-shadow: unset;
		border: unset;
		color: var(--text-muted);
	}

	.mod-plain:hover {
		color: var(--text-normal);
	}
</style>
