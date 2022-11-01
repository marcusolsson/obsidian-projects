import type { ProjectView } from "../../custom-view-api";
import { writable } from "svelte/store";

export const customViews = writable<Record<string, () => ProjectView>>({});
