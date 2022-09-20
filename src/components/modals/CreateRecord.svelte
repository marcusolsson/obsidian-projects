<script lang="ts">
	import Input from "../core/Input/Input.svelte";
	import { ButtonSetting, SettingItem } from "../core/Setting";
	import { Typography } from "../core/Typography";

	import { i18n } from "src/lib/stores/i18n";
	import type { WorkspaceDefinition } from "src/main";
	import { settings } from "src/lib/stores/settings";
	import Select from "../core/Select/Select.svelte";
	import { isValidPath } from "src/lib/path";

	export let name: string;
	export let workspace: WorkspaceDefinition;
	export let onSave: (
		name: string,
		templatePath: string,
		workspace: WorkspaceDefinition
	) => void;

	let templatePath = "";

	$: hasErrors = !isValidPath(name ?? "");
</script>

<Typography variant="h1">{$i18n.t("modals.record.create.title")}</Typography>

<SettingItem
	name={$i18n.t("modals.record.create.name.name")}
	description={$i18n.t("modals.record.create.name.description") ?? ""}
>
	<div>
		<Input value={name} onChange={(value) => (name = value)} autofocus />
		{#if !isValidPath(name ?? "")}
			<div>
				<small class="error">
					{$i18n.t("modals.workspace.defaultName.invalid")}
				</small>
			</div>
		{/if}
	</div>
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

{#if workspace.templates?.length}
	<SettingItem
		name={$i18n.t("modals.record.create.templatePath.name")}
		description={$i18n.t("modals.record.create.templatePath.description") ??
			""}
	>
		<Select
			value={templatePath}
			onChange={(value) => (templatePath = value)}
			options={workspace.templates.map((path) => ({
				label: path,
				value: path,
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
	disabled={hasErrors}
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
