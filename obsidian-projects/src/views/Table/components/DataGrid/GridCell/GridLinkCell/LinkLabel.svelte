<script lang="ts">
	import { InternalLink } from "obsidian-svelte";

	import type { Link } from "../../../../../../lib/data";
	import { app } from "../../../../../../lib/stores/obsidian";

	export let value: Link | undefined;
</script>

<div>
	{#if value}
		<InternalLink
			linkText={value.linkText}
			sourcePath={value.sourcePath}
			resolved={!!$app.metadataCache.getFirstLinkpathDest(
				value.linkText,
				value.sourcePath
			)}
			on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
				$app.workspace.openLinkText(linkText, sourcePath, newLeaf);
			}}
		>
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
