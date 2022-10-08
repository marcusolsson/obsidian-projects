<script lang="ts">
	import type { TFile } from "obsidian";

	import { Callout, Loading, Typography } from "obsidian-svelte";

	import { settings } from "../lib/stores/settings";
	import { app } from "../lib/stores/obsidian";
	import { api } from "../lib/stores/api";
	import { customViews, customViewsV2 } from "../lib/stores/custom-views";
	import { dataFrame, dataSource } from "../lib/stores/dataframe";

	import { BoardView } from "./views/Board";
	import { CalendarView } from "./views/Calendar";
	import { TableView } from "./views/Table";
	import { CustomView } from "./views/Custom";
	import { DeveloperView } from "./views/Developer";

	import Toolbar from "./Toolbar.svelte";

	import { isFile, resolveDataSource } from "./app";
	import type { DataRecord } from "../lib/types";

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
			dataSource.set(resolveDataSource(selectedProject));
		}
	}

	let querying: Promise<void>;

	$: {
		querying = (async () => {
			const source = $dataSource;
			if (source) {
				dataFrame.set(await source.queryAll());
			}
		})();
	}

	$: frame = $dataFrame;

	// Remember the last view and project we opened.
	$: settings.saveLayout(selectedProject?.id, selectedView?.id);

	$: viewComponent = selectedView
		? getViewComponent(selectedView.type)
		: null;

	// getViewComponent returns the Svelte component for the selected view type.
	// All built-in views have their own components, while custom views share
	// the CustomView component.
	function getViewComponent(type: string) {
		const standardViewComponents: Record<string, any> = {
			table: TableView,
			board: BoardView,
			calendar: CalendarView,
			developer: DeveloperView,
		};

		const standardComponent = standardViewComponents[type];

		if (standardComponent) {
			return standardComponent;
		}

		if ($customViewsV2[type] || $customViews[type]) {
			return CustomView;
		}

		return null;
	}

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

	function handleRecordAdd(record: DataRecord, templatePath: string) {
		if ($dataSource?.includes(record.id)) {
			dataFrame.addRecord(record);
		}
		$api.createNote(record, templatePath);
	}
	function handleRecordUpdate(record: DataRecord) {
		if ($dataSource?.includes(record.id)) {
			dataFrame.updateRecord(record);
		}
		$api.updateRecord(frame.fields, record);
	}
	function handleRecordDelete(id: string) {
		if ($dataSource?.includes(id)) {
			dataFrame.deleteRecord(id);
		}
		$api.deleteRecord(id);
	}
	function handleFieldRename(field: string, name: string) {
		dataFrame.renameField(field, name);
		$api.renameField(filesFromRecords($dataFrame.records), field, name);
	}
	function handleFieldDelete(field: string) {
		dataFrame.deleteField(field);
		$api.deleteField(filesFromRecords($dataFrame.records), field);
	}
	function filesFromRecords(records: DataRecord[]): TFile[] {
		return records
			.map((record) => record.id)
			.map((path) => {
				return $app.vault.getAbstractFileByPath(path);
			})
			.filter(isFile);
	}
</script>

<div class="projects-container">
	<Toolbar
		{projects}
		project={selectedProject?.id}
		onProjectChange={(projectId) => handleProjectChange(projectId)}
		view={selectedView?.id}
		onViewChange={(viewId) => handleViewChange(viewId)}
	/>

	{#await querying}
		<Loading />
	{:then}
		<div class="projects-main">
			{#if selectedView && viewComponent}
				<svelte:component
					this={viewComponent}
					{frame}
					type={selectedView.type}
					project={selectedProject}
					config={selectedView.config}
					readonly={$dataSource?.readonly() ?? true}
					onConfigChange={handleViewConfigChange}
					onRecordAdd={handleRecordAdd}
					onRecordUpdate={handleRecordUpdate}
					onRecordDelete={handleRecordDelete}
					onFieldRename={handleFieldRename}
					onFieldDelete={handleFieldDelete}
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
