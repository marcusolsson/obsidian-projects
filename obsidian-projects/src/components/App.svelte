<script lang="ts">
	import { settings } from "../lib/stores/settings";
	import { app } from "../lib/stores/obsidian";
	import { api } from "../lib/stores/api";

	import { BoardView } from "./views/Board";
	import { CalendarView } from "./views/Calendar";
	import { TableView } from "./views/Table";
	import { CustomView } from "./views/Custom";

	import WorkspaceToolbar from "./WorkspaceToolbar.svelte";

	import { customViews, customViewsV2 } from "../lib/stores/custom-views";
	import { isFile, resolveDataSource } from "./app";
	import { dataFrame, dataSource } from "../lib/stores/dataframe";
	import type { DataRecord } from "../lib/types";
	import type { TFile } from "obsidian";
	import { Callout, Progress, Typography } from "obsidian-svelte";

	$: workspaces = $settings.workspaces;

	$: selectedWorkspace = workspaces?.length
		? workspaces.find((w) => w.id === $settings.lastWorkspaceId) ||
		  workspaces[0]
		: null;

	$: selectedView = selectedWorkspace?.views?.length
		? selectedWorkspace?.views?.find(
				(v) => v.id === $settings.lastViewId
		  ) || selectedWorkspace.views[0]
		: null;

	let querying: Promise<void>;

	$: {
		if (selectedWorkspace) {
			dataSource.set(resolveDataSource(selectedWorkspace));
		}
	}

	$: {
		querying = (async () => {
			const source = $dataSource;
			if (source) {
				dataFrame.set(await source.queryAll());
			}
		})();
	}

	$: frame = $dataFrame;

	// Remember the last view and workspace we opened.
	$: settings.saveLayout(selectedWorkspace?.id, selectedView?.id);

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

	function handleWorkspaceChange(workspaceId: string) {
		if (!workspaces.length) {
			selectedWorkspace = null;
			selectedView = null;
			return;
		}

		const workspace = workspaces.find((ws) => ws.id === workspaceId);

		selectedWorkspace = workspace ? workspace : workspaces[0];

		if (selectedWorkspace) {
			if (!selectedWorkspace.views.length) {
				selectedView = null;
				return;
			}

			selectedView = selectedWorkspace.views[0];
		}
	}

	function handleViewChange(viewId: string) {
		if (!selectedWorkspace || !selectedWorkspace.views.length) {
			selectedView = null;
			return;
		}

		selectedView =
			selectedWorkspace.views.find((v) => v.id === viewId) ??
			selectedWorkspace.views[0];
	}

	function handleViewConfigChange(config: Record<string, any>) {
		if (selectedWorkspace?.id && selectedView?.id) {
			settings.updateViewConfig(
				selectedWorkspace.id,
				selectedView.id,
				config
			);
		}
	}

	function handleRecordAdd(record: DataRecord, templatePath: string) {
		if ($dataSource?.includes(record.id)) {
			dataFrame.addRecord(record);
		}
		$api.createRecord(record, templatePath);
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
			.map($app.vault.getAbstractFileByPath)
			.filter(isFile);
	}
</script>

<div class="projects-container">
	<WorkspaceToolbar
		{workspaces}
		workspace={selectedWorkspace?.id}
		onWorkspaceChange={(workspaceId) => handleWorkspaceChange(workspaceId)}
		view={selectedView?.id}
		onViewChange={(viewId) => handleViewChange(viewId)}
	/>

	{#await querying}
		<Progress />
	{:then}
		<div class="projects-main">
			{#if selectedView && viewComponent}
				<svelte:component
					this={viewComponent}
					{frame}
					type={selectedView.type}
					workspace={selectedWorkspace}
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
