import type { App } from "obsidian";
import type ProjectsPlugin from "src/main";
import type { ProjectsView } from "src/view";
import { derived, writable, type Writable } from "svelte/store";
import { RecordApi } from "./api";
import type { DataFrame } from "./datasource";

export type DataTable = string[][];
export type DataTableStore = Writable<DataTable>;

export const emptyDataFrame: DataFrame = {
	records: [],
	fields: [],
};

export const app = writable<App>();
export const view = writable<ProjectsView>();
export const plugin = writable<ProjectsPlugin>();

export const api = derived(app, ($app) => new RecordApi($app));
