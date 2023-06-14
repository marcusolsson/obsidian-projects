import { writable } from "svelte/store";

import type { ProjectView } from "src/customViewApi";

export const customViews = writable<Record<string, ProjectView>>({});
