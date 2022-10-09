<script lang="ts">
	import type { ProjectDefinition, ViewDefinition } from "../types";

	import { customViews, customViewsV2 } from "../lib/stores/custom-views";

	import { BoardView } from "../views/Board";
	import { CalendarView } from "../views/Calendar";
	import { TableView } from "../views/Table";
	import { CustomView } from "../views/Custom";
	import { DeveloperView } from "../views/Developer";
	import type { DataFrame } from "../lib/data";
	import type { ViewApi } from "./view-api";

	export let project: ProjectDefinition;
	export let view: ViewDefinition;
	export let frame: DataFrame;
	export let readonly: boolean;
	export let api: ViewApi;
	export let onConfigChange: (cfg: Record<string, any>) => void;

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

<svelte:component
	this={viewComponent}
	{frame}
	{project}
	type={view.type}
	config={view.config}
	{readonly}
	{api}
	{onConfigChange}
/>
