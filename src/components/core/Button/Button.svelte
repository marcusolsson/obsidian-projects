<script lang="ts">
	type ButtonVariant = "default" | "primary";

	export let variant: ButtonVariant = "default";
</script>

<button class:mod-cta={variant === "primary"}><slot /></button>
