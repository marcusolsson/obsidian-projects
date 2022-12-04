import type { App } from "obsidian";
import { writable } from "svelte/store";

import type ProjectsPlugin from "src/main";
import type { ProjectsView } from "src/view";

export const app = writable<App>();
export const view = writable<ProjectsView>();
export const plugin = writable<ProjectsPlugin>();
