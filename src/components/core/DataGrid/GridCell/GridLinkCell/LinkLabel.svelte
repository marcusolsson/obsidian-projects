<script lang="ts">
	import type { Link } from "src/lib/data";

	import { InternalLink } from "../../../../core/InternalLink";

	export let value: Link;
</script>

<div>
	<InternalLink linkText={value.linkText} sourcePath={value.sourcePath}>
		{value.linkText}
	</InternalLink>
</div>

<style>
	div {
		padding: 6px;
		width: 100%;
	}
</style>
