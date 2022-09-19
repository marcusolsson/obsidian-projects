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

<Typography variant="h1">{$i18n.t("modals.record.create.title")}</Typography>

<SettingItem
	name={$i18n.t("modals.record.create.name.name")}
	description={$i18n.t("modals.record.create.name.description") ?? ""}
>
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

<SettingItem
	name={$i18n.t("modals.record.create.templatePath.name")}
	description={$i18n.t("modals.record.create.templatePath.description") ?? ""}
>
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
	name={$i18n.t("modals.record.create.create")}
	cta
	onClick={() => onSave(interpolatedName, templatePath)}
/>
