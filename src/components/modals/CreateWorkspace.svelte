<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

	import type { WorkspaceDefinition } from "src/main";

	import { Typography } from "../core/Typography";
	import { SettingItem, ButtonSetting } from "../core/Setting";
	import { Checkbox } from "../core/Checkbox";
	import FileSuggestInput from "../core/Suggest/FileSuggestInput.svelte";
	import Input from "../core/Input/Input.svelte";

	export let onSave: (workspace: WorkspaceDefinition) => void;
	export let name: string = "Untitled workspace";
	export let path: string = "";
	export let recursive: boolean = false;
	export let noteTemplate: string;
</script>

<Typography variant="h1">Create new workspace</Typography>

<SettingItem name={"Workspace name"}>
	<Input value={name} onChange={(value) => (name = value)} autofocus />
</SettingItem>

<SettingItem
	name={"Workspace path"}
	description="Path to the folder you want to manage. Leave empty for root folder."
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
	name={"Recursive"}
	description="Manage notes in folders within the workspace path."
>
	<Checkbox value={recursive} onChange={(value) => (recursive = value)} />
</SettingItem>

<SettingItem
	name="Note template"
	description={"Note to use when creating new records."}
>
	<FileSuggestInput
		value={noteTemplate}
		onChange={(value) => (noteTemplate = value)}
		sourcePath=""
		include="notes"
		valueType="path"
	/>
</SettingItem>

<ButtonSetting
	name="Create workspace"
	cta
	onClick={() =>
		onSave({
			id: uuidv4(),
			name,
			path,
			recursive,
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
