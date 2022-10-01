import moment from "moment";
import { App, Modal } from "obsidian";
import { interpolateTemplate } from "../lib/templates";
import type { WorkspaceDefinition } from "../types";
import CreateRecord from "../components/modals/CreateRecord.svelte";
import { nextUniqueFileName } from "../lib/path";
import { i18n } from "../lib/stores/i18n";
import { get } from "svelte/store";

export class CreateRecordModal extends Modal {
	// @ts-ignore
	component: CreateRecord;

	workspace: WorkspaceDefinition;

	onSave: (
		name: string,
		templatePath: string,
		workspace: WorkspaceDefinition
	) => void;

	constructor(
		app: App,
		workspace: WorkspaceDefinition,
		onSave: (
			name: string,
			templatePath: string,
			workspace: WorkspaceDefinition
		) => void
	) {
		super(app);

		this.onSave = onSave;
		this.workspace = workspace;
	}

	onOpen() {
		this.component = new CreateRecord({
			target: this.contentEl,
			props: {
				name: this.workspace.defaultName
					? interpolateTemplate(this.workspace.defaultName ?? "", {
							date: (format) =>
								moment().format(format || "YYYY-MM-DD"),
							time: (format) =>
								moment().format(format || "HH:mm"),
					  })
					: nextUniqueFileName(
							this.workspace.path,
							get(i18n).t("modals.record.create.untitled")
					  ),
				workspace: this.workspace,
				onSave: (
					name: string,
					templatePath: string,
					workspace: WorkspaceDefinition
				) => {
					this.onSave(name, templatePath, workspace);
					this.close();
				},
			},
		});
	}

	onClose() {
		if (this.component) {
			this.component.$destroy();
		}
	}
}
