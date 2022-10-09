<script lang="ts">
	import { useIcon } from "../Icon/useIcon";

	/**
	 * Specifies the title of the callout.
	 */
	export let title: string;

	/**
	 * Specifies the icon next to the title.
	 */
	export let icon: string;

	/**
	 * Specifies the variant of callout, which determines the color.
	 */
	export let variant:
		| "info"
		| "todo"
		| "tip"
		| "success"
		| "question"
		| "warning"
		| "failure"
		| "danger"
		| "bug"
		| "example"
		| "quote";
</script>

<div
	data-callout-metadata
	data-callout-fold
	data-callout={variant}
	class="callout"
>
	<div class="callout-title">
		<div use:useIcon={icon} class="callout-icon" />
		<div class="callout-title-inner">{title}</div>
	</div>
	<div class="callout-content">
		<slot />
	</div>
</div>
