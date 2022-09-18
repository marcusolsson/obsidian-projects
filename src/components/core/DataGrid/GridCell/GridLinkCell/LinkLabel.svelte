<script lang="ts">
	import type { Link } from "src/lib/types";
	import { InternalLink } from "../../../../core/InternalLink";

	export let value: Link | undefined;
</script>

<div>
	{#if value}
		<InternalLink linkText={value.linkText} sourcePath={value.sourcePath}>
			{value.linkText}
		</InternalLink>
	{/if}
</div>

<style>
	div {
		padding: 6px;
		width: 100%;
	}
</style>
