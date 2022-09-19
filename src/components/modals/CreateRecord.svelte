<script lang="ts">
	import Input from "../core/Input/Input.svelte";
	import { ButtonSetting, SettingItem } from "../core/Setting";
	import { Typography } from "../core/Typography";

	import { app } from "../../lib/stores/obsidian";

	import { TAbstractFile, TFile, TFolder } from "obsidian";
	import { i18n } from "src/lib/stores/i18n";
	import type { WorkspaceDefinition } from "src/main";
	import { settings } from "src/lib/stores/settings";
	import Select from "../core/Select/Select.svelte";

	export let name: string;
	export let workspace: WorkspaceDefinition;
	export let onSave: (
		name: string,
		templatePath: string,
		workspace: WorkspaceDefinition
	) => void;

	let templatePath = "";

	$: templates = filesInFolder(workspace.templateFolder);

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
	<Input value={name} onChange={(value) => (name = value)} autofocus />
</SettingItem>

<SettingItem
	name={$i18n.t("modals.record.create.workspace.name")}
	description={$i18n.t("modals.record.create.workspace.description") ?? ""}
>
	<Select
		value={workspace.id}
		onChange={(id) => {
			const res = $settings.workspaces.find((w) => w.id === id);
			if (res) {
				workspace = res;
			}
		}}
		options={$settings.workspaces.map((workspace) => ({
			label: workspace.name,
			value: workspace.id,
		}))}
	/>
</SettingItem>

{#if templates.length}
	<SettingItem
		name={$i18n.t("modals.record.create.templatePath.name")}
		description={$i18n.t("modals.record.create.templatePath.description") ??
			""}
	>
		<Select
			value={templatePath}
			onChange={(value) => (templatePath = value)}
			options={templates.map((template) => ({
				label: template.basename,
				value: template.path,
			}))}
			placeholder={$i18n.t("modals.record.create.templatePath.none") ??
				""}
			allowEmpty
		/>
	</SettingItem>
{/if}

<ButtonSetting
	name={$i18n.t("modals.record.create.create")}
	cta
	onClick={() => onSave(name, templatePath, workspace)}
/>
