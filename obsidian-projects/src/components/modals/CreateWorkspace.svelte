<script lang="ts">
	import moment from "moment";
	import {
		Button,
		Checkbox,
		Input,
		SettingItem,
		ModalButtonGroup,
		ModalContent,
		ModalLayout,
		TextArea,
	} from "obsidian-svelte";

	import type { WorkspaceDefinition } from "../../types";
	import { isValidPath } from "../../lib/path";
	import { i18n } from "../../lib/stores/i18n";
	import { interpolateTemplate } from "../../lib/templates";
	import { FileListInput } from "../core/FileListInput";
	import FileSuggestInput from "../core/Suggest/FileSuggestInput.svelte";
	import { notEmpty } from "../views/Board/board";
	import { capabilities } from "obsidian-projects/src/lib/stores/capabilities";
	import { settings } from "obsidian-projects/src/lib/stores/settings";
	import Callout from "obsidian-svelte/src/components/Callout/Callout.svelte";

	export let title: string;
	export let cta: string;
	export let onSave: (workspace: WorkspaceDefinition) => void;
	export let workspace: WorkspaceDefinition;

	let originalName = workspace.name;

	$: workspaces = $settings.workspaces;

	$: defaultName = interpolateTemplate(workspace.defaultName ?? "", {
		date: (format) => moment().format(format || "YYYY-MM-DD"),
		time: (format) => moment().format(format || "HH:mm"),
	});

	$: ({ name } = workspace);
	$: nameError = validateName(name);

	function validateName(name: string) {
		if (name === originalName) {
			return "";
		}

		if (name === "") {
			return $i18n.t("modals.workspace.create.empty-name-error");
		}

		if (workspaces.find((workspace) => workspace.name === name)) {
			return $i18n.t("modals.workspace.create.existing-name-error");
		}

		return "";
	}
</script>

<ModalLayout {title}>
	<ModalContent>
		<SettingItem
			name={$i18n.t("modals.workspace.name.name")}
			description={$i18n.t("modals.workspace.name.description") ?? ""}
		>
			<Input
				value={workspace.name}
				on:input={({ detail: name }) =>
					(workspace = { ...workspace, name })}
				autofocus
				error={!!nameError}
				helperText={nameError}
			/>
		</SettingItem>

		{#if workspace.dataview || $capabilities.dataview}
			<SettingItem
				name={$i18n.t("modals.workspace.dataview.name")}
				description={$i18n.t("modals.workspace.dataview.description") ??
					""}
			>
				<Checkbox
					checked={!!workspace.dataview}
					on:check={({ detail: dataview }) =>
						(workspace = { ...workspace, dataview })}
				/>
			</SettingItem>
		{/if}

		{#if workspace.dataview && !$capabilities.dataview}
			<Callout
				title={$i18n.t("modals.workspace.dataview.error.title")}
				icon="zap"
				variant="danger"
			>
				{$i18n.t("modals.workspace.dataview.error.message")}
			</Callout>
		{/if}

		{#if workspace.dataview}
			<SettingItem
				name={$i18n.t("modals.workspace.query.name")}
				description={$i18n.t("modals.workspace.query.description") ??
					""}
				vertical
			>
				<TextArea
					value={workspace.query ?? ""}
					on:input={({ detail: query }) =>
						(workspace = { ...workspace, query })}
					rows={6}
					width="100%"
				/>
			</SettingItem>
		{:else}
			<SettingItem
				name={$i18n.t("modals.workspace.path.name")}
				description={$i18n.t("modals.workspace.path.description") ?? ""}
				vertical
			>
				<FileSuggestInput
					value={workspace.path}
					onChange={(path) => (workspace = { ...workspace, path })}
					sourcePath=""
					include="folders"
					valueType="path"
					fullWidth
				/>
			</SettingItem>

			<SettingItem
				name={$i18n.t("modals.workspace.recursive.name")}
				description={$i18n.t(
					"modals.workspace.recursive.description"
				) ?? ""}
			>
				<Checkbox
					checked={workspace.recursive}
					on:check={({ detail: recursive }) =>
						(workspace = { ...workspace, recursive })}
				/>
			</SettingItem>
		{/if}

		<SettingItem
			name={$i18n.t("modals.workspace.defaultName.name")}
			description={$i18n.t("modals.workspace.defaultName.description") ??
				""}
			vertical
		>
			<Input
				value={workspace.defaultName ?? ""}
				on:input={({ detail: defaultName }) =>
					(workspace = { ...workspace, defaultName })}
				width="100%"
			/>
			<small>
				{defaultName}
			</small>
			{#if !isValidPath(defaultName)}
				<small class="error"
					>{$i18n.t("modals.workspace.defaultName.invalid")}</small
				>
			{/if}
		</SettingItem>

		<SettingItem
			name={$i18n.t("modals.workspace.templates.name")}
			description={$i18n.t("modals.workspace.templates.description") ??
				""}
			vertical
		>
			<FileListInput
				paths={workspace.templates ?? []}
				onPathsChange={(templates) =>
					(workspace = { ...workspace, templates })}
			/>
		</SettingItem>
	</ModalContent>
	<ModalButtonGroup>
		<Button
			variant="primary"
			disabled={!!nameError}
			on:click={() => {
				onSave({
					...workspace,
					templates: workspace.templates?.filter(notEmpty) ?? [],
				});
			}}>{cta}</Button
		>
	</ModalButtonGroup>
</ModalLayout>

<style>
	small {
		font-size: var(--font-ui-smaller);
		color: var(--text-accent);
		font-weight: var(--font-semibold);
	}
	.error {
		color: var(--text-error);
	}
</style>
