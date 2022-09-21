<script lang="ts">
	import moment from "moment";
	import { Checkbox, Input, Typography } from "obsidian-ui";

	import type { WorkspaceDefinition } from "obsidian-projects/src/main";
	import { isValidPath } from "../../lib/path";
	import { i18n } from "../../lib/stores/i18n";
	import { interpolateTemplate } from "../../lib/template";
	import { FileListInput } from "../core/FileListInput";
	import { ButtonSetting, SettingItem } from "../core/Setting";
	import FileSuggestInput from "../core/Suggest/FileSuggestInput.svelte";
	import { notEmpty } from "../views/Board/board";

	export let title: string;
	export let cta: string;
	export let onSave: (workspace: WorkspaceDefinition) => void;
	export let workspace: WorkspaceDefinition;

	$: defaultName = interpolateTemplate(workspace.defaultName ?? "", {
		date: (format) => moment().format(format || "YYYY-MM-DD"),
		time: (format) => moment().format(format || "HH:mm"),
	});
</script>

<Typography variant="h1">{title}</Typography>

<SettingItem
	name={$i18n.t("modals.workspace.name.name")}
	description={$i18n.t("modals.workspace.name.description") ?? ""}
>
	<Input
		value={workspace.name}
		on:input={({ detail: name }) => (workspace = { ...workspace, name })}
		autofocus
	/>
</SettingItem>

<SettingItem
	name={$i18n.t("modals.workspace.path.name")}
	description={$i18n.t("modals.workspace.path.description") ?? ""}
>
	<FileSuggestInput
		value={workspace.path}
		onChange={(path) => (workspace = { ...workspace, path })}
		sourcePath=""
		include="folders"
		valueType="path"
	/>
</SettingItem>

<SettingItem
	name={$i18n.t("modals.workspace.recursive.name")}
	description={$i18n.t("modals.workspace.recursive.description") ?? ""}
>
	<Checkbox
		checked={workspace.recursive}
		on:check={({ detail: recursive }) =>
			(workspace = { ...workspace, recursive })}
	/>
</SettingItem>

<SettingItem
	name={$i18n.t("modals.workspace.defaultName.name")}
	description={$i18n.t("modals.workspace.defaultName.description") ?? ""}
>
	<div>
		<Input
			value={workspace.defaultName ?? ""}
			on:input={({ detail: defaultName }) =>
				(workspace = { ...workspace, defaultName })}
		/>
		<div>
			<small>
				{defaultName}
			</small>
		</div>
		{#if !isValidPath(defaultName)}
			<div>
				<small class="error"
					>{$i18n.t("modals.workspace.defaultName.invalid")}</small
				>
			</div>
		{/if}
	</div></SettingItem
>

<SettingItem
	name={$i18n.t("modals.workspace.templates.name")}
	description={$i18n.t("modals.workspace.templates.description") ?? ""}
/>

<FileListInput
	paths={workspace.templates ?? []}
	onPathsChange={(templates) => (workspace = { ...workspace, templates })}
/>

<ButtonSetting
	name={cta}
	cta
	onClick={() =>
		onSave({
			...workspace,
			templates: workspace.templates?.filter(notEmpty) ?? [],
		})}
/>

<style>
	small {
		font-size: var(--font-ui-smaller);
		color: var(--text-muted);
	}
	.error {
		color: var(--text-error);
	}
</style>
