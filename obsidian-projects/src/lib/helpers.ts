import { normalizePath, TFile } from "obsidian";
import { get } from "svelte/store";
import type { ProjectDefinition, ViewDefinition } from "../types";
import { app } from "obsidian-projects/src/lib/stores/obsidian";

/**
 * notEmpty is a convenience function for filtering arrays with optional values.
 */
export function notEmpty<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}

export function uniquify(name: string, exists: (name: string) => boolean) {
	if (!exists(name)) {
		return name;
	}

	let num: number = 1;
	while (exists(name + " " + num)) {
		num++;
	}

	return name + " " + num;
}

export function nextUniqueFileName(path: string, name: string) {
	return uniquify(name, (name) => {
		return (
			get(app).vault.getAbstractFileByPath(
				normalizePath(path + "/" + name + ".md")
			) instanceof TFile
		);
	});
}

export function nextUniqueProjectName(
	projects: ProjectDefinition[],
	name: string
) {
	return uniquify(name, (candidate) => {
		return !!projects.find((project) => project.name === candidate);
	});
}

export function nextUniqueViewName(views: ViewDefinition[], name: string) {
	return uniquify(name, (candidate) => {
		return !!views.find((view) => view.name === candidate);
	});
}
