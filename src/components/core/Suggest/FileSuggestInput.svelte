<script lang="ts">
	import SuggestInput from "./SuggestInput.svelte";
	import { app } from "src/lib/stores/obsidian";
	import { TFile, TFolder, Vault } from "obsidian";

	export let value: string;
	export let onChange: (value: string, file: TFile | null) => void;
	export let sourcePath: string;
	export let embed: boolean = false;
	export let include: "notes" | "files" | "folders" | "all" = "all";
	export let valueType: "path" | "name" = "name";

	function handleSuggest(value: string) {
		const values: { id: string; title: string; note: string }[] = [];

		Vault.recurseChildren($app.vault.getRoot(), (file) => {
			switch (include) {
				case "notes":
					if (file instanceof TFile && file.extension === "md") {
						values.push({
							id: file.path,
							title:
								valueType === "name"
									? file.basename
									: file.path,
							note:
								valueType === "name"
									? file.path
											.split("/")
											.slice(0, -1)
											.join("/")
									: "",
						});
					}
					break;
				case "files":
					if (file instanceof TFile) {
						values.push({
							id: file.path,
							title:
								valueType === "name"
									? file.basename
									: file.path,
							note:
								valueType === "name"
									? file.path
											.split("/")
											.slice(0, -1)
											.join("/")
									: "",
						});
					}
					break;
				case "folders":
					if (file instanceof TFolder) {
						values.push({
							id: file.path,
							title: valueType === "name" ? file.name : file.path,
							note:
								valueType === "name"
									? file.path
											.split("/")
											.slice(0, -1)
											.join("/")
									: "",
						});
					}
					break;
				case "all":
					values.push({
						id: file.path,
						title: valueType === "name" ? file.name : file.path,
						note:
							valueType === "name"
								? file.path.split("/").slice(0, -1).join("/")
								: "",
					});
					break;
			}
		});

		return values.filter(
			({ title }) =>
				title &&
				title.toLocaleLowerCase().contains(value.toLocaleLowerCase())
		);
	}
	function handleSelect(value: string) {
		const file = $app.metadataCache.getFirstLinkpathDest(value, sourcePath);
		onChange(value, file);
	}
</script>

<SuggestInput
	{value}
	onSuggest={handleSuggest}
	onChange={handleSelect}
	{embed}
/>
