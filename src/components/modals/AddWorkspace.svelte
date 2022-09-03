<script lang="ts">
	import { v4 as uuidv4 } from "uuid";

	import type { WorkspaceDefinition } from "src/main";

	import { Typography } from "../core/Typography";
	import { SettingItem, ButtonSetting } from "../core/Setting";
	import { Checkbox } from "../core/Checkbox";

	export let onSave: (workspace: WorkspaceDefinition) => void;

	let name: string = "Untitled workspace";
	let path: string = "";
	let recursive: boolean = false;
</script>

<Typography variant="h1">Add workspace</Typography>

<SettingItem name={"Workspace name"}>
	<input type="text" bind:value={name} />
</SettingItem>

<SettingItem
	name={"Workspace path"}
	description="Path to the folder you want to manage. Leave empty for root folder."
>
	<input type="text" bind:value={path} />
</SettingItem>

<SettingItem
	name={"Recursive"}
	description="Manage notes in folders within the workspace path."
>
	<Checkbox value={recursive} onChange={(value) => (recursive = value)} />
</SettingItem>

<ButtonSetting
	name="Add workspace"
	cta
	onClick={() =>
		onSave({
			id: uuidv4(),
			name,
			path,
			recursive,
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
