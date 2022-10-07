import i18next from "i18next";
// import { moment } from "obsidian";
import { createI18nStore } from "svelte-i18next";

i18next.init({
	// lng: moment.locale(),
	lng: "en",
	resources: {
		en: {
			translation: {
				"data-types": {
					string: "Text",
					number: "Number",
					boolean: "True or false",
					date: "Date",
					link: "Link",
					list: "List",
					unknown: "Unknown data type",
				},
				commands: {
					"show-projects": {
						name: "Show projects",
					},
					"create-project": {
						name: "Create new project",
					},
					"create-note": {
						name: "Create new note",
					},
				},
				menus: {
					project: {
						create: {
							title: "Create project in folder",
						},
					},
				},
				modals: {
					project: {
						create: {
							"short-title": "New project",
							untitled: "Untitled project",
							title: "Create new project",
							cta: "Create project",
							"existing-name-error":
								"A project with that name already exists.",
							"empty-name-error": "Project name can't be empty.",
						},
						edit: {
							"short-title": "Edit project",
							title: "Edit project",
							cta: "Save",
						},
						delete: {
							"short-title": "Delete project",
							title: "Delete project",
							message:
								"Are you sure you want to delete the project?",
							cta: "Delete",
						},
						name: {
							name: "Name",
							description: "",
						},
						path: {
							name: "Path",
							description:
								"Path to the folder you want to manage. Leave empty to use root folder.",
						},
						dataview: {
							name: "Use Dataview",
							description:
								"Use Dataview to query read-only data instead of using paths.",
							error: {
								title: "Dataview is disabled",
								message:
									"Enable the Dataview plugin to continue using this project.",
							},
						},
						query: {
							name: "Query",
							description: "Only supports TABLE queries.",
						},
						recursive: {
							name: "Include subfolders",
							description:
								"Manage notes inside subfolders within the project path.",
						},
						templates: {
							name: "Templates",
							description:
								"Templates to choose from when you create new notes.",
						},
						defaultName: {
							name: "Default name",
							description:
								"Default name for new notes. Supports {{date}} and {{time}} template variables.",
							invalid: "Contains illegal characters.",
						},
					},
					view: {
						create: {
							"short-title": "New view",
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
							"existing-name-error":
								"A view with that name already exists.",
						},
						delete: {
							"short-title": "Delete view",
							title: "Delete view",
							message:
								"Are you sure you want to delete the view?",
							cta: "Delete",
						},
					},
					note: {
						create: {
							"short-title": "New note",
							title: "Create new note",
							name: {
								name: "Name",
								description: "",
							},
							templatePath: {
								name: "Template",
								description: "",
								none: "None",
							},
							project: {
								name: "Project",
								description: "",
							},
							"name-taken-error":
								"A note with that name already exists.",
							"empty-name-error": "Name can't be empty.",
							create: "Create note",
							readonly: {
								title: "Read-only project",
								message:
									"{{project}} is a read-only project. Select another project to create a note.",
							},
							untitled: "Untitled note",
						},
						edit: {
							"short-title": "Edit note",
							title: "Edit note",
							save: "Save",
							"no-editable-fields": {
								title: "No editable fields",
								message: "This note has no editable fields.",
							},
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
					developer: {
						name: "Developer",
					},
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
							status: "Status",
							priority: "Priority",
							none: "None",
						},
						unprioritized: "Unprioritized",
						note: {
							add: "Add note",
						},
					},
					calendar: {
						name: "Calendar",
						"new-note": "New note",
						fields: {
							date: "Date",
							check: "Check",
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
							hide: "Hide field",
						},
						row: {
							add: "Add note",
							edit: "Edit note",
							delete: "Delete note",
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
					projects: {
						none: "No projects",
					},
				},
				errors: {
					missingDataview: {
						title: "Dataview is disabled",
						message:
							"Enable the Dataview plugin to continue using this project.",
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
