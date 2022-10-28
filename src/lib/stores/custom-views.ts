import type { ProjectView, ProjectViewV2 } from "../../builder";
import { writable } from "svelte/store";

export const customViews = writable<
  Record<string, (view: ProjectView) => void>
>({});

export const customViewsV2 = writable<Record<string, () => ProjectViewV2>>({});
