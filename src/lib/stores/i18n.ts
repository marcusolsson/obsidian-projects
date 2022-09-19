import i18next from "i18next";
// import { moment } from "obsidian";
import { createI18nStore } from "svelte-i18next";

i18next.init({
	// lng: moment.locale(),
	lng: "en",
	resources: {
		en: {
			translation: {
				commands: {
					"create-workspace": {
						name: "Create new workspace",
					},
					"show-projects": {
						name: "Show Projects",
					},
				},
				menus: {
					workspace: {
						create: {
							title: "Create workspace in folder",
						},
					},
				},
				modals: {
					workspace: {
						create: {
							title: "Create new workspace",
							cta: "Create",
						},
						edit: {
							title: "Edit workspace",
							cta: "Save",
						},
						delete: {
							title: "Delete workspace",
							message:
								"Are you sure you want to delete the workspace?",
							cta: "Delete",
						},
						name: {
							name: "Workspace name",
							description: "",
						},
						path: {
							name: "Workspace path",
							description:
								"Path to the folder you want to manage. Leave empty for root folder.",
						},
						recursive: {
							name: "Recursive",
							description:
								"Manage notes in folders within the workspace path.",
						},
						templateFolder: {
							name: "Template folder",
							description:
								"Folder containing templates to use for new records.",
						},
						noteTemplate: {
							name: "Note template",
							description:
								"Template to use when creating new records.",
						},
					},
					view: {
						create: {
							title: "Add new view",
							optional: "Optional",
							type: {
								name: "Type",
								description: "",
							},
							name: {
								name: "Name",
								description: "",
							},
							cta: "Add view",
						},
						delete: {
							title: "Delete view",
							message:
								"Are you sure you want to delete the view?",
							cta: "Delete",
						},
					},
					record: {
						create: {
							title: "Create new record",
							name: {
								name: "Name",
								description: "",
							},
							templatePath: {
								name: "Template",
								description: "",
							},
							create: "Create record",
						},
						edit: {
							title: "Edit record",
							save: "Save",
						},
					},
					input: {
						cancel: "Cancel",
					},
					confirm: {
						delete: "Delete",
						cancel: "Cancel",
					},
				},
				views: {
					table: {
						name: "Table",
						"hide-fields": "Hide fields",
						"rename-field": "Rename field",
						rename: "Rename",
					},
					board: {
						name: "Board",
						"no-status": "No status",
						fields: {
							status: "Status field",
							priority: "Priority field",
							none: "None",
						},
						unprioritized: "Unprioritized",
						record: {
							add: "Add record",
						},
					},
					calendar: {
						name: "Calendar",
						fields: {
							date: "Date field",
							none: "None",
						},
						today: "Today",
						weekday: "{{value, datetime}}",
						date: "{{value, datetime}}",
						interval: "{{from, datetime}} – {{to, datetime}}",
						intervals: {
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
				components: {
					"data-grid": {
						column: {
							rename: "Rename field",
							delete: "Delete field",
							hide: "Hide column",
						},
						row: {
							add: "Add row",
							edit: "Edit record",
							delete: "Delete record",
						},
						cell: {
							clear: "Clear value",
						},
						sort: {
							asc: "Sort A → Z",
							desc: "Sort Z → A",
						},
					},
				},
				toolbar: {
					view: {
						add: "Add view",
					},
					workspaces: {
						none: "No workspaces",
					},
				},
			},
		},
	},
	interpolation: {
		escapeValue: false, // not needed for svelte as it escapes by default
	},
});

export const i18n = createI18nStore(i18next);
