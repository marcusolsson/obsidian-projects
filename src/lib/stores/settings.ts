import type { ProjectsPluginSettings } from "src/main";
import { writable } from "svelte/store";

export const settings = writable<ProjectsPluginSettings>({ workspaces: [] });
