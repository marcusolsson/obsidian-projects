<script lang="ts">
	import SuggestInput from "./SuggestInput.svelte";
	import { app } from "src/lib/stores/obsidian";
	import type { TFile } from "obsidian";

	export let value: string;
	export let onChange: (value: string, file: TFile | null) => void;
	export let sourcePath: string;

	function handleSuggest(value: string) {
		return $app.vault
			.getMarkdownFiles()
			.filter((file) =>
				file.basename
					.toLocaleLowerCase()
					.contains(value.toLocaleLowerCase())
			)
			.map((file) => ({
				id: file.path,
				title: file.basename,
				note: file.path.split("/").slice(0, -1).join("/"),
			}));
	}
	function handleSelect(value: string) {
		const file = $app.metadataCache.getFirstLinkpathDest(value, sourcePath);
		onChange(value, file);
	}
</script>

<SuggestInput {value} onSuggest={handleSuggest} onChange={handleSelect} />
