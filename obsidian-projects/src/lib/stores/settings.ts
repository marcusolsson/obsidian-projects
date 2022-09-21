import type { ProjectsPluginSettings } from "../../main";
import { writable } from "svelte/store";

export const settings = writable<ProjectsPluginSettings>({ workspaces: [] });
