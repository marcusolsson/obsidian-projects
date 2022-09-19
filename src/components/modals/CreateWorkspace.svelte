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

<SettingItem
	name={$i18n.t("modals.workspace.name.name")}
	description={$i18n.t("modals.workspace.name.description") ?? ""}
>
	<Input value={name} onChange={(value) => (name = value)} autofocus />
</SettingItem>

<SettingItem
	name={$i18n.t("modals.workspace.path.name")}
	description={$i18n.t("modals.workspace.path.description") ?? ""}
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
	name={$i18n.t("modals.workspace.recursive.name")}
	description={$i18n.t("modals.workspace.recursive.description") ?? ""}
>
	<Checkbox value={recursive} onChange={(value) => (recursive = value)} />
</SettingItem>

<SettingItem
	name={$i18n.t("modals.workspace.templateFolder.name")}
	description={$i18n.t("modals.workspace.templateFolder.description") ?? ""}
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
	name={$i18n.t("modals.workspace.noteTemplate.name")}
	description={$i18n.t("modals.workspace.noteTemplate.description") ?? ""}
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
					name: $i18n.t("views.table.name"),
					type: "table",
					config: {},
				},
			],
		})}
/>
