<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

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
	export let name: string = $i18n.t("untitled-workspace");
	export let path: string = "";
	export let recursive: boolean = false;
	export let noteTemplate: string;
	export let templateFolder: string;
</script>

<Typography variant="h1">{title}</Typography>

<SettingItem name={$i18n.t("workspace-name")}>
	<Input value={name} onChange={(value) => (name = value)} autofocus />
</SettingItem>

<SettingItem
	name={$i18n.t("workspace-modal.path") ?? ""}
	description={$i18n.t("workspace-modal.path-help") ?? ""}
>
	<FileSuggestInput
		value={path}
		onChange={(value) => (path = value)}
		sourcePath=""
		include="folders"
		valueType="path"
	/>
</SettingItem>

<SettingItem
	name={$i18n.t("workspace-modal.recursive") ?? ""}
	description={$i18n.t("workspace-modal.recursive-help") ?? ""}
>
	<Checkbox value={recursive} onChange={(value) => (recursive = value)} />
</SettingItem>

<SettingItem
	name={$i18n.t("workspace-modal.template-folder") ?? ""}
	description={$i18n.t("workspace-modal.template-folder-help") ?? ""}
>
	<FileSuggestInput
		value={templateFolder}
		onChange={(value) => (templateFolder = value)}
		sourcePath=""
		include="folders"
		valueType="path"
	/>
</SettingItem>

<SettingItem
	name={$i18n.t("workspace-modal.note-template") ?? ""}
	description={$i18n.t("workspace-modal.note-template-help") ?? ""}
>
	<Input
		value={noteTemplate}
		onChange={(value) => (noteTemplate = value)}
		placeholder={`{{title}}`}
	/>
</SettingItem>

<ButtonSetting
	name={cta}
	cta
	onClick={() =>
		onSave({
			id: uuidv4(),
			name,
			path,
			recursive,
			templateFolder,
			noteTemplate,
			views: [
				{
					id: uuidv4(),
					name: "Table",
					type: "table",
					config: {},
				},
			],
		})}
/>
