<script lang="ts">
	import type { App } from "obsidian";

	import { DataviewDataSource } from "src/lib/datasources/dataview/dataview";
	import { FrontMatterDataSource } from "src/lib/datasources/frontmatter/frontmatter";

	import { dataSource } from "src/lib/stores/dataframe";
	import { app } from "src/lib/stores/obsidian";

	import type { DataSource } from "src/lib/data";
	import type { ProjectDefinition } from "src/types";

	import Toolbar from "./toolbar/Toolbar.svelte";

	export let projects: ProjectDefinition[];

	$: selectedProject = projects[0];
	$: views = selectedProject?.views || [];
	$: selectedView = views[0];

	$: {
		if (selectedProject) {
			// Different projects can have different data sources.
			dataSource.set(resolveDataSource(selectedProject, $app));
		}
	}

	// resolveDataSource selects the data source to use based on the project
	// settings.
	function resolveDataSource(
		project: ProjectDefinition,
		app: App
	): DataSource {
		return project.dataview
			? new DataviewDataSource(app, project)
			: new FrontMatterDataSource(app, project);
	}
</script>

<!--
	@component

	AppContainer manages switching between projects and views.
 -->
<div class="projects-container">
	<Toolbar
		{projects}
		projectId={selectedProject?.id}
		onProjectChange={(projectId) => {
			selectedProject =
				projects.find((project) => project.id === projectId) ||
				projects[0];
		}}
		viewId={selectedView?.id}
		onViewChange={(viewId) => {
			if (views) {
				selectedView = views.find((v) => v.id === viewId) ?? views[0];
			}
		}}
	/>

	<div class="projects-main">
		<slot project={selectedProject} view={selectedView} />
	</div>
</div>

<style>
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
