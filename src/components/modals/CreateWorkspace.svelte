<script lang="ts">
	import type { WorkspaceDefinition } from "src/main";

	import { Typography } from "../core/Typography";
	import { SettingItem, ButtonSetting } from "../core/Setting";
	import { Checkbox } from "../core/Checkbox";
	import FileSuggestInput from "../core/Suggest/FileSuggestInput.svelte";
	import Input from "../core/Input/Input.svelte";
	import { i18n } from "../../lib/stores/i18n";

	export let title: string;
	export let cta: string;
	export let onSave: (workspace: WorkspaceDefinition) => void;
	export let workspace: WorkspaceDefinition;
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
	name={$i18n.t("modals.workspace.templateFolder.name")}
	description={$i18n.t("modals.workspace.templateFolder.description") ?? ""}
>
	<FileSuggestInput
		value={workspace.templateFolder}
		onChange={(templateFolder) =>
			(workspace = { ...workspace, templateFolder })}
		sourcePath=""
		include="folders"
		valueType="path"
	/>
</SettingItem>

<SettingItem
	name={$i18n.t("modals.workspace.defaultName.name")}
	description={$i18n.t("modals.workspace.defaultName.description") ?? ""}
>
	<Input
		value={workspace.defaultName}
		onChange={(defaultName) => (workspace = { ...workspace, defaultName })}
	/>
</SettingItem>

<ButtonSetting name={cta} cta onClick={() => onSave(workspace)} />
