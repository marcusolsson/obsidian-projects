<script lang="ts">
	import type { WorkspaceDefinition } from "src/main";

	import { Typography } from "../core/Typography";
	import { SettingItem, ButtonSetting } from "../core/Setting";
	import { Checkbox } from "../core/Checkbox";
	import FileSuggestInput from "../core/Suggest/FileSuggestInput.svelte";
	import Input from "../core/Input/Input.svelte";
	import { i18n } from "../../lib/stores/i18n";
	import { FileListInput } from "../core/FileListInput";
	import { notEmpty } from "../views/Board/board";
	import { isValidPath } from "src/lib/path";
	import { interpolateTemplate } from "src/lib/template";
	import moment from "moment";

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
		onChange={(name) => (workspace = { ...workspace, name })}
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
		value={workspace.recursive}
		onChange={(recursive) => (workspace = { ...workspace, recursive })}
	/>
</SettingItem>

<SettingItem
	name={$i18n.t("modals.workspace.defaultName.name")}
	description={$i18n.t("modals.workspace.defaultName.description") ?? ""}
>
	<div>
		<Input
			value={workspace.defaultName ?? ""}
			onChange={(defaultName) =>
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
