<script lang="ts">
	import { useIcon } from "../Icon/useIcon";

	export let title: string;
	export let icon: string;
	export let variant: string;
</script>

<div
	data-callout-metadata
	data-callout-fold
	data-callout={variant}
	class="callout"
>
	<div class="callout-title">
		<div use:useIcon={{ name: icon, size: 16 }} class="callout-icon" />
		<div class="callout-title-inner">{title}</div>
	</div>
	<div class="callout-content">
		<slot />
	</div>
</div>
