import type { Builder } from "src/builder";
import { writable } from "svelte/store";

export const customViews = writable<Record<string, () => Builder>>({});
