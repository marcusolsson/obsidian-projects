import type { ProjectViewV2 } from "../../custom-view-api";
import { writable } from "svelte/store";

export const customViews = writable<Record<string, () => ProjectViewV2>>({});
