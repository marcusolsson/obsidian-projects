<script lang="ts">
	import { Input, Select, Typography } from "obsidian-svelte";

	import { ButtonSetting, SettingItem } from "../core/Setting";

	import { isValidPath } from "../../lib/path";
	import { i18n } from "../../lib/stores/i18n";
	import { settings } from "../../lib/stores/settings";
	import type { WorkspaceDefinition } from "../../main";

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
		<Input
			value={name}
			on:input={({ detail: value }) => (name = value)}
			autofocus
		/>
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
		on:change={({ detail: id }) => {
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
			on:change={({ detail: value }) => (templatePath = value)}
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
