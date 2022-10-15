import type { App } from "obsidian";
import type ProjectsPlugin from "../../main";
import type { ProjectsView } from "../../view";
import { writable } from "svelte/store";

export const app = writable<App>();
export const view = writable<ProjectsView>();
export const plugin = writable<ProjectsPlugin>();
