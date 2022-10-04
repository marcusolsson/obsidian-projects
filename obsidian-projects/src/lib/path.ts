import { normalizePath, TFile } from "obsidian";
import os from "os";
import { get } from "svelte/store";
import { app } from "../lib/stores/obsidian";
import type { ViewDefinition, ProjectDefinition } from "../types";

export function isValidPath(path: string) {
	const illegalCharacters: Record<string, RegExp> = {
		darwin: /[\\\/\|\#\^\[\]]/,
		win32: /[\\\/\|\:\<\>\*\"\?]/,
	};

	const expr = illegalCharacters[os.platform()];

	if (!expr) {
		return true;
	}

	return !expr.test(path);
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
