<script lang="ts">
	import moment from "moment";
	import {
		Button,
		FileAutocomplete,
		ModalButtonGroup,
		ModalContent,
		ModalLayout,
		SettingItem,
		Switch,
		TextArea,
		TextInput,
		Callout,
	} from "obsidian-svelte";

	import { i18n } from "../../lib/stores/i18n";
	import { app } from "../../lib/stores/obsidian";
	import { capabilities } from "../../lib/stores/capabilities";
	import { settings } from "../../lib/stores/settings";

	import { isValidPath } from "../../lib/path";
	import { interpolateTemplate } from "../../lib/templates";
	import type { ProjectDefinition } from "../../types";
	import {
		getFoldersInFolder,
		notEmpty,
	} from "obsidian-projects/src/app/app";
	import { FileListInput } from "obsidian-projects/src/components/FileListInput";

	export let title: string;
	export let cta: string;
	export let onSave: (project: ProjectDefinition) => void;
	export let project: ProjectDefinition;

	let originalName = project.name;

	$: projects = $settings.projects;

	$: defaultName = interpolateTemplate(project.defaultName ?? "", {
		date: (format) => moment().format(format || "YYYY-MM-DD"),
		time: (format) => moment().format(format || "HH:mm"),
	});

	$: ({ name } = project);
	$: nameError = validateName(name);

	function validateName(name: string) {
		if (name === originalName) {
			return "";
		}

		if (name === "") {
			return $i18n.t("modals.project.create.empty-name-error");
		}

		if (projects.find((project) => project.name === name)) {
			return $i18n.t("modals.project.create.existing-name-error");
		}

		return "";
	}
</script>

<ModalLayout {title}>
	<ModalContent>
		<SettingItem
			name={$i18n.t("modals.project.name.name")}
			description={$i18n.t("modals.project.name.description") ?? ""}
		>
			<TextInput
				value={project.name}
				on:input={({ detail: name }) =>
					(project = { ...project, name })}
				autoFocus
				error={!!nameError}
				helperText={nameError}
			/>
		</SettingItem>

		{#if project.dataview || $capabilities.dataview}
			<SettingItem
				name={$i18n.t("modals.project.dataview.name")}
				description={$i18n.t("modals.project.dataview.description") ??
					""}
			>
				<Switch
					checked={!!project.dataview}
					on:check={({ detail: dataview }) =>
						(project = { ...project, dataview })}
				/>
			</SettingItem>
		{/if}

		{#if project.dataview && !$capabilities.dataview}
			<Callout
				title={$i18n.t("modals.project.dataview.error.title")}
				icon="zap"
				variant="danger"
			>
				{$i18n.t("modals.project.dataview.error.message")}
			</Callout>
		{/if}

		{#if project.dataview}
			<SettingItem
				name={$i18n.t("modals.project.query.name")}
				description={$i18n.t("modals.project.query.description") ?? ""}
				vertical
			>
				<TextArea
					value={project.query ?? ""}
					on:input={({ detail: query }) =>
						(project = { ...project, query })}
					rows={6}
					width="100%"
				/>
			</SettingItem>
		{:else}
			<SettingItem
				name={$i18n.t("modals.project.path.name")}
				description={$i18n.t("modals.project.path.description") ?? ""}
				vertical
			>
				<FileAutocomplete
					files={getFoldersInFolder($app.vault.getRoot())}
					value={project.path}
					on:change={({ detail: path }) =>
						(project = { ...project, path })}
					getLabel={(file) => file.path}
					width="100%"
				/>
			</SettingItem>

			<SettingItem
				name={$i18n.t("modals.project.recursive.name")}
				description={$i18n.t("modals.project.recursive.description") ??
					""}
			>
				<Switch
					checked={project.recursive}
					on:check={({ detail: recursive }) =>
						(project = { ...project, recursive })}
				/>
			</SettingItem>
		{/if}

		<SettingItem
			name={$i18n.t("modals.project.defaultName.name")}
			description={$i18n.t("modals.project.defaultName.description") ??
				""}
			vertical
		>
			<TextInput
				value={project.defaultName ?? ""}
				on:input={({ detail: defaultName }) =>
					(project = { ...project, defaultName })}
				width="100%"
			/>
			<small>
				{defaultName}
			</small>
			{#if !isValidPath(defaultName)}
				<small class="error"
					>{$i18n.t("modals.project.defaultName.invalid")}</small
				>
			{/if}
		</SettingItem>

		<SettingItem
			name={$i18n.t("modals.project.templates.name")}
			description={$i18n.t("modals.project.templates.description") ?? ""}
			vertical
		>
			<FileListInput
				paths={project.templates ?? []}
				onPathsChange={(templates) =>
					(project = { ...project, templates })}
			/>
		</SettingItem>
	</ModalContent>
	<ModalButtonGroup>
		<Button
			variant="primary"
			disabled={!!nameError}
			on:click={() => {
				onSave({
					...project,
					templates: project.templates?.filter(notEmpty) ?? [],
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
