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

	/**
	 * Specifies the variant of text.
	 */
	export let variant: TypographyVariant;

	/**
	 * Specifies whether to remove the default margin.
	 */
	export let nomargin: boolean = false;

	/**
	 * Elements to use for each variant.
	 */
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
	class:setting-item-name={variant === "label"}
>
	<slot />
</svelte:element>

<style>
	.nomargin {
		margin: 0;
	}
</style>
