<script lang="ts">
	type TypographyVariant =
		| "h1"
		| "h2"
		| "h3"
		| "h4"
		| "h5"
		| "h6"
		| "body"
		| "label";

	export let variant: TypographyVariant;
	export let nomargin: boolean = false;

	const elements = {
		h1: "h1",
		h2: "h2",
		h3: "h3",
		h4: "h4",
		h5: "h5",
		h6: "h6",
		body: "p",
		label: "p",
	};
</script>

<svelte:element
	this={elements[variant]}
	class:nomargin
	class:label={variant === "label"}
>
	<slot />
</svelte:element>

<style>
	.nomargin {
		margin: 0;
	}

	.label {
		font-weight: 500;
	}
</style>
