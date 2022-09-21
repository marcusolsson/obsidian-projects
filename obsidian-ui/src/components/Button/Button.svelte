<script lang="ts">
	type ButtonVariant = "default" | "destructive" | "primary" | "plain";

	/**
	 * Specifies the variant of the button.
	 */
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
	button {
		/* Add a gap between text and icons. */
		gap: var(--size-4-1);
	}

	.mod-plain {
		background: none;
		box-shadow: none;
		border: none;

		color: var(--text-muted);
	}

	.mod-plain:hover {
		color: var(--text-normal);
	}
</style>
