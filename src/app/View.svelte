<script lang="ts">
	import type { ProjectDefinition, ViewDefinition } from "../types";

	import { customViews, customViewsV2 } from "../lib/stores/custom-views";

	import type { DataFrame } from "../lib/data";
	import { BoardView } from "../views/Board";
	import { CalendarView } from "../views/Calendar";
	import { CustomView } from "../views/Custom";
	import { DeveloperView } from "../views/Developer";
	import { TableView } from "../views/Table";
	import type { ViewApi } from "../lib/view-api";

	export let project: ProjectDefinition;
	export let view: ViewDefinition;
	export let frame: DataFrame;
	export let readonly: boolean;
	export let api: ViewApi;
	export let onConfigChange: (
		projectId: string,
		viewId: string,
		cfg: Record<string, any>
	) => void;

	function handleConfigChange(config: Record<string, any>) {
		if (project.id && view.id) {
			onConfigChange(project.id, view.id, config);
		}
	}

	$: viewComponent = view ? getViewComponent(view.type) : null;

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
</script>

<!--
	@component

	View dynamically selects the component to use based on a ViewDefinition.
-->
<svelte:component
	this={viewComponent}
	{frame}
	{project}
	type={view.type}
	config={view.config}
	{readonly}
	{api}
	onConfigChange={handleConfigChange}
/>
