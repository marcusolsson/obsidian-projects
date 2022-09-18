import i18next from "i18next";
import { createI18nStore } from "svelte-i18next";

i18next.init({
	lng: "en",
	resources: {
		en: {
			translation: {
				table: "Table",
				board: "Board",
				calendar: "Calendar",
				optional: "Optional",
				name: "Name",
				template: "Template",
				"view-type": "View type",
				"view-name": "View name",
				"edit-workspace": "Edit workspace",
				"delete-workspace": "Delete workspace",
				"confirm-delete-workspace":
					"Are you sure you want to delete the workspace?",
				"delete-view": "Delete view",
				"confirm-delete-view":
					"Are you sure you want to delete the view?",
				"add-view": "Add view",
				"rename-field": "Rename field",
				"no-date-fields": "No date fields",
				"add-record": "Add a record",
				unprioritized: "Unprioritized",
				"no-status": "No status",
				"status-field": "Status field",
				"priority-field": "Priority field",
				"create-new-record": "Create new record",
				"create-record": "Create record",
				"untitled-workspace": "Untitled workspace",
				"workspace-name": "Workspace name",
				"workspace-modal": {
					path: "Workspace path",
					"path-help":
						"Path to the folder you want to manage. Leave empty for root folder.",
					recursive: "Recursive",
					"recursive-help":
						"Manage notes in folders within the workspace path.",
					"template-folder": "Template folder",
					"template-folder-help":
						"Folder containing templates to use for new records.",
					"note-template": "Note template",
					"note-template-help":
						"Template to use when creating new records.",
				},
				"edit-record": "Edit record",
				none: "None",
				save: "Save",
				cancel: "Cancel",
				delete: "Delete",
				rename: "Rename",
				month_one: "Month",
				month_other: "Months",
				monthWithCount_one: "{{count}} month",
				monthWithCount_other: "{{count}} months",
				week_one: "Week",
				week_other: "Weeks",
				weekWithCount_one: "{{count}} week",
				weekWithCount_other: "{{count}} weeks",
				day_one: "Day",
				day_other: "Days",
				dayWithCount_one: "{{count}} day",
				dayWithCount_other: "{{count}} days",
			},
		},
	},
	interpolation: {
		escapeValue: false, // not needed for svelte as it escapes by default
	},
});

export const i18n = createI18nStore(i18next);
