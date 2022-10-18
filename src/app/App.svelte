<script lang="ts">
	import { Callout, Loading, Typography } from "obsidian-svelte";

	import { settings } from "../lib/stores/settings";
	import { app } from "../lib/stores/obsidian";
	import { i18n } from "../lib/stores/i18n";
	import { api } from "../lib/stores/api";
	import { dataFrame, dataSource } from "../lib/stores/dataframe";

	import Toolbar from "./Toolbar.svelte";

	import type { DataSource } from "../lib/data";
	import type { ProjectDefinition } from "../types";
	import { DataviewDataSource } from "../lib/datasources/dataview/dataview";
	import { FrontMatterDataSource } from "../lib/datasources/frontmatter/frontmatter";
	import View from "./View.svelte";
	import { ViewApi } from "./view-api";
	import type { App } from "obsidian";
	import { onMount } from "svelte";
	import { OnboardingModal } from "./onboarding/onboarding-modal";
	import { CreateProjectModal } from "src/modals/create-project-modal";
	import { createProject } from "src/lib/api";
	import { createDemoProject } from "./onboarding/demo-project";

	$: projects = $settings.projects;

	$: selectedProject = projects?.length
		? projects.find((project) => project.id === $settings.lastProjectId) ||
		  projects[0]
		: null;

	$: views = selectedProject?.views;

	$: selectedView = views?.length
		? views.find((view) => view.id === $settings.lastViewId) || views[0]
		: null;

	$: {
		if (selectedProject) {
			// Different projects can have different data sources.
			dataSource.set(resolveDataSource(selectedProject, $app));
		}
	}

	$: viewApi = $dataSource ? new ViewApi($app, $dataSource, $api) : null;

	onMount(() => {
		if (!projects.length) {
			new OnboardingModal(
				$app,
				() => {
					new CreateProjectModal(
						$app,
						$i18n.t("modals.project.create.title"),
						$i18n.t("modals.project.create.cta"),
						settings.addProject,
						createProject()
					).open();
				},
				() => {
					createDemoProject($app.vault);
				}
			).open();
		}
	});

	let querying: Promise<void>;

	$: {
		// Perform a full refresh of the data frame whenever the data source
		// changes.
		querying = (async () => {
			if ($dataSource) {
				dataFrame.set(await $dataSource.queryAll());
			}
		})();
	}

	// Remember the last view and project we opened.
	$: settings.saveLayout(selectedProject?.id, selectedView?.id);

	function handleProjectChange(projectId: string) {
		if (!projects.length) {
			selectedProject = null;
			selectedView = null;
			return;
		}

		selectedProject =
			projects.find((project) => project.id === projectId) || projects[0];

		if (selectedProject) {
			if (!selectedProject.views.length) {
				selectedView = null;
				return;
			}

			selectedView = selectedProject.views[0];
		}
	}

	function handleViewChange(viewId: string) {
		if (!selectedProject || !selectedProject.views.length) {
			selectedView = null;
			return;
		}

		selectedView =
			selectedProject.views.find((v) => v.id === viewId) ??
			selectedProject.views[0];
	}

	function handleViewConfigChange(config: Record<string, any>) {
		if (selectedProject?.id && selectedView?.id) {
			settings.updateViewConfig(
				selectedProject.id,
				selectedView.id,
				config
			);
		}
	}

	function resolveDataSource(
		project: ProjectDefinition,
		app: App
	): DataSource {
		if (project.dataview) {
			return new DataviewDataSource(app, project);
		}
		return new FrontMatterDataSource(app, project);
	}
</script>

<!--
	@component

	App is the main application component and coordinates between the View and
	the Toolbar.
-->
<div class="projects-container">
	<Toolbar
		{projects}
		projectId={selectedProject?.id}
		onProjectChange={(projectId) => handleProjectChange(projectId)}
		viewId={selectedView?.id}
		onViewChange={(viewId) => handleViewChange(viewId)}
	/>

	{#await querying}
		<Loading />
	{:then}
		<div class="projects-main">
			{#if selectedProject && selectedView && viewApi}
				<View
					project={selectedProject}
					view={selectedView}
					readonly={$dataSource?.readonly() ?? true}
					api={viewApi}
					onConfigChange={handleViewConfigChange}
					frame={$dataFrame}
				/>
			{/if}
		</div>
	{:catch error}
		<div style="padding: var(--size-4-3)">
			<Callout title={error.name} icon="zap" variant="danger">
				<Typography variant="body">{error.message}</Typography>
			</Callout>
		</div>
	{/await}
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	.projects-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.projects-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}
</style>
