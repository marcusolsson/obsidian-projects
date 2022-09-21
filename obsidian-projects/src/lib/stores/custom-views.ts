import type { Builder } from "../../builder";
import { writable } from "svelte/store";

export const customViews = writable<Record<string, () => Builder>>({});
