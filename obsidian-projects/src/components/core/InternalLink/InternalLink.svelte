<script lang="ts">
	import { app } from "../../../lib/stores/obsidian";

	export let linkText: string;
	export let sourcePath: string;

	const metadataCache = $app.metadataCache;

	$: resolved = !!metadataCache.getFirstLinkpathDest(linkText, sourcePath);
</script>

<a
	href={linkText}
	data-href={linkText}
	class={`internal-link`}
	class:is-unresolved={!resolved}
	target="blank"
	rel="noopener"
	on:click={(event) => {
		$app.workspace.openLinkText(
			linkText,
			sourcePath,
			event.ctrlKey || event.metaKey
		);
		event.preventDefault();
	}}
>
	<slot />
</a>

<style>
	.is-unresolved {
		opacity: 0.5;
	}
</style>
