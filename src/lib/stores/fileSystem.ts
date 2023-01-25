import { derived } from "svelte/store";
import { ObsidianFileSystem } from "../filesystem/obsidian/obsidian";
import { app } from "src/lib/stores/obsidian";

export const fileSystem = derived(app, ($app) => new ObsidianFileSystem($app));
