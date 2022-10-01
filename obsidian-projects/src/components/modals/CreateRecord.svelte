<script lang="ts">
	import { normalizePath, TFile } from "obsidian";
	import {
		Button,
		Input,
		Select,
		SettingItem,
		ModalButtonGroup,
		ModalContent,
		ModalLayout,
	} from "obsidian-svelte";
	import Callout from "obsidian-svelte/src/components/Callout/Callout.svelte";

	import { isValidPath } from "../../lib/path";
	import { i18n } from "../../lib/stores/i18n";
	import { app } from "../../lib/stores/obsidian";
	import { settings } from "../../lib/stores/settings";
	import type { WorkspaceDefinition } from "../../types";

	export let name: string;
	export let workspace: WorkspaceDefinition;
	export let onSave: (
		name: string,
		templatePath: string,
		workspace: WorkspaceDefinition
	) => void;

	let templatePath = "";

	$: nameError = validateName(name);

	function validateName(name: string) {
		if (name === "") {
			return $i18n.t("modals.record.create.empty-name-error");
		}

		const existingFile = $app.vault.getAbstractFileByPath(
			normalizePath(workspace.path + "/" + name + ".md")
		);

		if (existingFile instanceof TFile) {
			return $i18n.t("modals.record.create.name-taken-error");
		}

		if (!isValidPath(name)) {
			return $i18n.t("modals.workspace.defaultName.invalid");
		}

		return "";
	}
</script>

<ModalLayout title={$i18n.t("modals.record.create.title")}>
	<ModalContent>
		<SettingItem
			name={$i18n.t("modals.record.create.name.name")}
			description={$i18n.t("modals.record.create.name.description") ?? ""}
		>
			<Input
				value={name}
				on:input={({ detail: value }) => (name = value)}
				autofocus
				error={!!nameError}
				helperText={nameError}
			/>
		</SettingItem>

		<SettingItem
			name={$i18n.t("modals.record.create.workspace.name")}
			description={$i18n.t(
				"modals.record.create.workspace.description"
			) ?? ""}
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
				description={$i18n.t(
					"modals.record.create.templatePath.description"
				) ?? ""}
			>
				<Select
					value={templatePath}
					on:change={({ detail: value }) => (templatePath = value)}
					options={workspace.templates.map((path) => ({
						label: path,
						value: path,
					}))}
					placeholder={$i18n.t(
						"modals.record.create.templatePath.none"
					) ?? ""}
					allowEmpty
				/>
			</SettingItem>
		{/if}
		{#if workspace.dataview}
			<Callout
				title={$i18n.t("modals.record.create.readonly.title")}
				icon="alert-triangle"
				variant="danger"
			>
				{$i18n.t("modals.record.create.readonly.message", {
					project: workspace.name,
				})}
			</Callout>
		{/if}
	</ModalContent>
	<ModalButtonGroup>
		<Button
			variant={"primary"}
			disabled={!!nameError || !!workspace.dataview}
			on:click={() => {
				onSave(name, templatePath, workspace);
			}}
		>
			{$i18n.t("modals.record.create.create")}
		</Button>
	</ModalButtonGroup>
</ModalLayout>
