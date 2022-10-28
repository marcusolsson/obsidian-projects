import { normalizePath, TFile } from "obsidian";
import { get } from "svelte/store";
import type { ProjectDefinition, ViewDefinition } from "../types";
import { app } from "src/lib/stores/obsidian";

/**
 * notEmpty is a convenience function for filtering arrays with optional values.
 */
export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * uniquify appends a sequence number to a string, where the number is the
 * lowest available according to a callback function.
 *
 * @param name is the preferred name.
 * @param exists is a predicate for whether a candidate string is already taken.
 */
export function uniquify(
  name: string,
  exists: (name: string) => boolean
): string {
  if (!exists(name)) {
    return name;
  }

  let num: number = 1;
  while (exists(name + " " + num)) {
    num++;
  }

  return name + " " + num;
}

/**
 * nextUniqueFileName returns the given file name with the lowest available
 * sequence number appended to it.
 */
export function nextUniqueFileName(path: string, name: string) {
  return uniquify(name, (name) => {
    return (
      get(app).vault.getAbstractFileByPath(
        normalizePath(path + "/" + name + ".md")
      ) instanceof TFile
    );
  });
}

/**
 * nextUniqueProjectName returns the given project name with the lowest
 * available sequence number appended to it.
 */
export function nextUniqueProjectName(
  projects: ProjectDefinition[],
  name: string
) {
  return uniquify(name, (candidate) => {
    return !!projects.find((project) => project.name === candidate);
  });
}

/**
 * nextUniqueViewName returns the given project name with the lowest
 * available sequence number appended to it.
 */
export function nextUniqueViewName(views: ViewDefinition[], name: string) {
  return uniquify(name, (candidate) => {
    return !!views.find((view) => view.name === candidate);
  });
}
