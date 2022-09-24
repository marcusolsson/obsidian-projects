import { get } from "svelte/store";
import { addIcon, Plugin, TFolder } from "obsidian";
import produce from "immer";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { ProjectsView, VIEW_TYPE_PROJECTS } from "./view";
import { createDataRecord, createWorkspace } from "./lib/api";
import type { WorkspaceDefinition } from "./types";

import { registerFileEvents } from "./lib/stores/file-index";
import { settings } from "./lib/stores/settings";
import { app, plugin } from "./lib/stores/obsidian";
import { api } from "./lib/stores/api";
import { i18n } from "./lib/stores/i18n";

import { CreateWorkspaceModal } from "./modals/create-workspace-modal";
import { CreateRecordModal } from "./modals/create-record-modal";

dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);

export interface ProjectsPluginSettings {
	lastWorkspaceId?: string | undefined;
	lastViewId?: string | undefined;
	workspaces: WorkspaceDefinition[];
}

export const DEFAULT_SETTINGS: Partial<ProjectsPluginSettings> = {
	workspaces: [],
};

export default class ProjectsPlugin extends Plugin {
	// @ts-ignore
	unsubscribeSettings: Unsubscriber;

	async onload() {
		const t = get(i18n).t;

		this.registerView(
			VIEW_TYPE_PROJECTS,
			(leaf) => new ProjectsView(leaf, this)
		);

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item.setTitle(t("menus.workspace.create.title"))
							.setIcon("folder-plus")
							.onClick(async () => {
								const workspace = createWorkspace();
								new CreateWorkspaceModal(
									this.app,
									t("modals.workspace.create.title"),
									t("modals.workspace.create.cta"),
									(workspace) => {
										settings.update((state) => {
											return produce(state, (draft) => {
												draft.workspaces.push(
													workspace
												);
												return draft;
											});
										});
									},
									{
										...workspace,
										name: file.name,
										path: file.path,
									}
								).open();
							});
					});
				}
			})
		);

		this.addCommand({
			id: "show-projects",
			name: t("commands.show-projects.name"),
			callback: () => {
				this.activateView();
			},
		});

		this.addCommand({
			id: "create-workspace",
			name: t("commands.create-workspace.name"),
			callback: () => {
				new CreateWorkspaceModal(
					this.app,
					t("modals.workspace.create.title"),
					t("modals.workspace.create.cta"),
					(workspace) => {
						settings.update((state) => {
							return produce(state, (draft) => {
								draft.workspaces.push(workspace);
								return draft;
							});
						});
					},
					createWorkspace()
				).open();
			},
		});

		this.addCommand({
			id: "create-record",
			name: t("commands.create-record.name"),
			// checkCallback because we don't want to create records if there are no
			// workspaces.
			checkCallback: (checking) => {
				const workspace = get(settings).workspaces[0];

				if (workspace) {
					if (!checking) {
						new CreateRecordModal(
							this.app,
							workspace,
							async (name, templatePath, workspace) => {
								const file = await get(api).createRecord(
									createDataRecord(name, workspace),
									templatePath
								);

								this.app.workspace.getLeaf(true).openFile(file);
							}
						).open();
					}

					return true;
				}

				return false;
			},
		});

		this.addRibbonIcon("layout", "Open projects", () => {
			this.activateView();
		});

		addIcon(
			"text",
			`<g transform="matrix(1,0,0,1,2,2)"><path d="M20,32L28,32L28,24L41.008,24L30.72,72L20,72L20,80L52,80L52,72L42.992,72L53.28,24L68,24L68,32L76,32L76,16L20,16L20,32Z" /></g>`
		);

		registerFileEvents(this);

		// Initialize Svelte stores.
		app.set(this.app);
		plugin.set(this);
		settings.set(
			Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
		);

		// Save settings to disk whenever settings has been updated.
		this.unsubscribeSettings = settings.subscribe((value) => {
			this.saveData(value);
		});
	}

	async onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_PROJECTS);

		this.unsubscribeSettings();
	}

	// activateView opens the main Projects view in a new workspace leaf.
	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_PROJECTS);

		await this.app.workspace.getLeaf(true).setViewState({
			type: VIEW_TYPE_PROJECTS,
			active: true,
		});

		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_PROJECTS);

		if (leaves[0]) {
			this.app.workspace.revealLeaf(leaves[0]);
		}
	}
}
