import { writable } from "svelte/store";

import type { ProjectView } from "src/custom-view-api";

export const customViews = writable<Record<string, ProjectView>>({});
