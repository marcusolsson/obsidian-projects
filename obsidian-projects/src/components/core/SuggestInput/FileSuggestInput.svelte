<script lang="ts">
	import SuggestInput from "./SuggestInput.svelte";
	import { app } from "../../../lib/stores/obsidian";
	import { TAbstractFile, TFile, TFolder, Vault } from "obsidian";

	export let value: string;
	export let onChange: (value: string, file: TFile | null) => void;
	export let sourcePath: string;
	export let embed: boolean = false;
	export let include: "notes" | "files" | "folders" | "all" = "all";
	export let valueType: "path" | "name" = "name";
	export let files: TFile[] | undefined = undefined;
	export let disabled: boolean = false;
	export let placeholder: string = "";
	export let fullWidth: boolean = false;

	function* filesInFolder(
		folder: TFolder,
		predicate: (file: TAbstractFile) => boolean
	): IterableIterator<TAbstractFile> {
		const res: TAbstractFile[] = [];

		Vault.recurseChildren(folder, (file) => {
			if (predicate(file)) {
				res.push(file);
			}
		});

		for (let file of res) {
			yield file;
		}
	}

	async function handleSuggest(
		query: string
	): Promise<Array<{ id: string; title: string; note: string }>> {
		if (files) {
			return files.map((file) => ({
				id: file.path,
				title: valueType === "name" ? file.basename : file.path,
				note:
					valueType === "name"
						? file.path.split("/").slice(0, -1).join("/")
						: "",
			}));
		}

		const values: { id: string; title: string; note: string }[] = [];

		const filteredFiles = filesInFolder($app.vault.getRoot(), (file) => {
			if (valueType === "name") {
				return file.name
					.toLocaleLowerCase()
					.contains(query.toLocaleLowerCase());
			} else {
				return file.path
					.toLocaleLowerCase()
					.contains(query.toLocaleLowerCase());
			}
		});

		// TODO: This loop can make the UI unresponsive for large vaults.
		// Should probably time out after ~200ms and return the results collected
		// until then.
		for (let file of filteredFiles) {
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
		}

		return values;
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
	{disabled}
	{placeholder}
	{fullWidth}
/>
