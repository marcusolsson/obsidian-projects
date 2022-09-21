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
	} from "obsidian-svelte";

	import type { WorkspaceDefinition } from "obsidian-projects/src/main";
	import { isValidPath } from "../../lib/path";
	import { i18n } from "../../lib/stores/i18n";
	import { interpolateTemplate } from "../../lib/template";
	import { FileListInput } from "../core/FileListInput";
	import FileSuggestInput from "../core/Suggest/FileSuggestInput.svelte";
	import { notEmpty } from "../views/Board/board";

	export let title: string;
	export let cta: string;
	export let onSave: (workspace: WorkspaceDefinition) => void;
	export let workspace: WorkspaceDefinition;

	$: defaultName = interpolateTemplate(workspace.defaultName ?? "", {
		date: (format) => moment().format(format || "YYYY-MM-DD"),
		time: (format) => moment().format(format || "HH:mm"),
	});
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
			/>
		</SettingItem>

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
			description={$i18n.t("modals.workspace.recursive.description") ??
				""}
		>
			<Checkbox
				checked={workspace.recursive}
				on:check={({ detail: recursive }) =>
					(workspace = { ...workspace, recursive })}
			/>
		</SettingItem>

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
		color: var(--text-muted);
	}
	.error {
		color: var(--text-error);
	}
</style>
