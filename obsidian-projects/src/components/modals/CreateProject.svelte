<script lang="ts">
	import moment from "moment";
	import {
		Button,
		Checkbox,
		TextInput,
		SettingItem,
		ModalButtonGroup,
		ModalContent,
		ModalLayout,
		TextArea,
	} from "obsidian-svelte";

	import type { ProjectDefinition } from "../../types";
	import { isValidPath } from "../../lib/path";
	import { i18n } from "../../lib/stores/i18n";
	import { interpolateTemplate } from "../../lib/templates";
	import { FileListInput } from "../core/FileListInput";
	import FileAutocomplete from "../core/SuggestInput/FileAutocomplete.svelte";
	import { notEmpty } from "../views/Board/board";
	import { capabilities } from "obsidian-projects/src/lib/stores/capabilities";
	import { settings } from "obsidian-projects/src/lib/stores/settings";
	import Callout from "obsidian-svelte/src/components/Callout/Callout.svelte";
	import { getFoldersInFolder } from "../app";
	import { app } from "../../lib/stores/obsidian";

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
				<Checkbox
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
					files={getFoldersInFolder($app.vault.getRoot(), false)}
					value={project.path}
					on:change={({ detail: path }) =>
						(project = { ...project, path })}
					getOptionLabel={(file) => file.path}
					width="100%"
				/>
			</SettingItem>

			<SettingItem
				name={$i18n.t("modals.project.recursive.name")}
				description={$i18n.t("modals.project.recursive.description") ??
					""}
			>
				<Checkbox
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
