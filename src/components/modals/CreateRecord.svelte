<script lang="ts">
	import Input from "../core/Input/Input.svelte";
	import { ButtonSetting, SettingItem } from "../core/Setting";
	import FileSuggestInput from "../core/Suggest/FileSuggestInput.svelte";
	import { Typography } from "../core/Typography";

	import { interpolateTemplate } from "src/lib/template";
	import { app } from "../../lib/stores/obsidian";

	import moment from "moment";
	import { TAbstractFile, TFile, TFolder } from "obsidian";
	import { i18n } from "src/lib/stores/i18n";

	export let name: string = $i18n.t("untitled-workspace");
	export let noteTemplate: string;
	export let templateFolder: string;
	export let onSave: (name: string, templatePath: string) => void;

	let templatePath = "";

	$: interpolatedName = interpolateTemplate(noteTemplate, {
		title: () => name,
		date: (format) => moment().format(format),
		time: (format) => moment().format(format),
	});

	function isTFile(file: TAbstractFile): file is TFile {
		return file instanceof TFile;
	}

	function filesInFolder(folderPath: string): TFile[] {
		const folder = $app.vault.getAbstractFileByPath(folderPath);
		if (folder instanceof TFolder) {
			return folder.children.filter(isTFile);
		}
		return [];
	}
</script>

<Typography variant="h1">{$i18n.t("create-new-record")}</Typography>

<SettingItem name={$i18n.t("name")}>
	{#if noteTemplate}
		<div>
			<Input
				value={name}
				onChange={(value) => (name = value)}
				autofocus
			/>
			<div
				style="color: var(--text-faint); font-size: var(--font-ui-smaller); margin-top: 8px;"
			>
				{interpolatedName}
			</div>
		</div>
	{:else}
		<Input value={name} onChange={(value) => (name = value)} autofocus />
	{/if}
</SettingItem>

<SettingItem name={$i18n.t("template")}>
	<FileSuggestInput
		value={templatePath}
		onChange={(value) => (templatePath = value)}
		sourcePath=""
		include="files"
		valueType="path"
		files={filesInFolder(templateFolder)}
	/>
</SettingItem>

<ButtonSetting
	name={$i18n.t("Create record")}
	cta
	onClick={() => onSave(interpolatedName, templatePath)}
/>
