import type { ProjectView } from "../../builder";
import { writable } from "svelte/store";

export const customViews = writable<
	Record<string, (view: ProjectView) => void>
>({});
